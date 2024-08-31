let emailjsServiceID, emailjsTemplateID, emailjsPublicKey;

// Fetch API keys from the serverless function
fetch('/api/keys')
    .then(response => response.json())
    .then(data => {
        emailjsServiceID = data.emailjs_serviceID;
        emailjsTemplateID = data.emailjs_templateID;
        emailjsPublicKey = data.emailjs_publickey;

        // Initialize EmailJS securely
        emailjs.init(emailjsPublicKey);

        // DOM elements
        const navMenu = document.getElementById('nav-menu'),
              navToggle = document.getElementById('nav-toggle'),
              navClose = document.getElementById('nav-close');

        // Menu show
        if(navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show');
            });
        }

        // Menu hidden
        if(navClose) {
            navClose.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        }

        // Remove mobile menu
        const navLink = document.querySelectorAll('.nav__link');
        navLink.forEach((n) => n.addEventListener('click', linkAction));
        function linkAction() {
            navMenu.classList.remove('show');
        }

        // Scroll sections active link
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', scrollActive);
        function scrollActive() {
            const scrollY = window.pageYOffset;
            sections.forEach((current) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
                } else {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
                }
            });
        }

        // Change background header
        window.addEventListener('scroll', scrollHeader);
        function scrollHeader() {
            const header = document.getElementById('header');
            if (this.scrollY >= 80) header.classList.add('scroll-header');
            else header.classList.remove('scroll-header');
        }

        // Show scroll up
        window.addEventListener('scroll', scrollUp);
        function scrollUp() {
            const scrollUp = document.getElementById('scroll-up');
            if (this.scrollY >= 350) scrollUp.classList.add('show-scroll');
            else scrollUp.classList.remove('show-scroll');
        }

        // About tabs
        const tabs = document.querySelectorAll('[data-target]'),
              tabsContents = document.querySelectorAll('[data-content]');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = document.querySelector(tab.dataset.target);
                
                tabsContents.forEach((tabContent) => {
                    tabContent.classList.remove('tab__active');
                });

                target.classList.add('tab__active');

                tabs.forEach((tab) => {
                    tab.classList.remove('tab__active');
                });

                tab.classList.add('tab__active');
            });
        });

        // Contact form and input sanitization
        const contactForm = document.getElementById('contact-form'),
              contactName = document.getElementById('contact-name'),
              contactEmail = document.getElementById('contact-email'),
              contactSubject = document.getElementById('contact-subject'),
              contactMessage = document.getElementById('contact-message'),
              errorMessage = document.getElementById('error-message');

        const sanitizeInput = (input) => {
            const element = document.createElement('div');
            element.innerText = input;
            return element.innerHTML;
        };

        const sendEmail = (e) => {
            e.preventDefault();

            // Sanitize inputs
            contactName.value = sanitizeInput(contactName.value);
            contactEmail.value = sanitizeInput(contactEmail.value);
            contactSubject.value = sanitizeInput(contactSubject.value);
            contactMessage.value = sanitizeInput(contactMessage.value);

            if(contactName.value === '' || contactEmail.value === '' || contactMessage.value === '' || contactSubject.value === '') {
                errorMessage.textContent = 'Write all the input fields';
            } else {
                emailjs.sendForm(emailjsServiceID, emailjsTemplateID, '#contact-form', emailjsPublicKey)
                    .then(() => {
                        errorMessage.classList.add('color-first');
                        errorMessage.textContent = 'Message sent ✔️';
                        
                        setTimeout(() => {
                            errorMessage.textContent = '';
                        }, 5000);
                    }, (error) => {
                        errorMessage.textContent = 'Oops! Something went wrong...';
                        console.error('Error:', error);
                    });

                contactName.value = '';
                contactEmail.value = '';
                contactSubject.value = '';
                contactMessage.value = '';
            }
        };

        contactForm.addEventListener('submit', sendEmail);
    })
    .catch(error => console.error('Error fetching API keys:', error));
