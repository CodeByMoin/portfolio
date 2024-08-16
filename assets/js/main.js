let emailjsServiceID, emailjsTemplateID, emailjsPublicKey;

        // Fetch API keys from the serverless function
        fetch('/api/keys')
            .then(response => response.json())
            .then(data => {
                emailjsServiceID = data.emailjs_serviceID;
                emailjsTemplateID = data.emailjs_templateID;
                emailjsPublicKey = data.emailjs_publickey;

                // Initialize EmailJS
                emailjs.init(emailjsPublicKey);

                // Your existing JavaScript code

                const navMenu = document.getElementById('nav-menu'),
                navToggle = document.getElementById('nav-toggle'),
                navClose = document.getElementById('nav-close');

                /*===== MENU SHOW =====*/
                if(navToggle) {
                    navToggle.addEventListener('click', () => {
                        navMenu.classList.add('show');
                    });
                }

                /*===== MENU HIDDEN =====*/
                if(navClose) {
                    navClose.addEventListener('click', () => {
                        navMenu.classList.remove('show');
                    });
                }

                /*==================== REMOVE MENU MOBILE ====================*/
                const navLink = document.querySelectorAll('.nav__link');

                function linkAction() {
                    const navMenu = document.getElementById('nav-menu');
                    navMenu.classList.remove('show');
                } 

                navLink.forEach((n) => n.addEventListener('click', linkAction));

                /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
                const sections = document.querySelectorAll('section[id]');

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

                window.addEventListener('scroll', scrollActive);

                /*==================== CHANGE BACKGROUND HEADER ====================*/
                function scrollHeader() {
                    const header = document.getElementById('header');
                    if (this.scrollY >= 80) header.classList.add('scroll-header');
                    else header.classList.remove('scroll-header');
                }

                window.addEventListener('scroll', scrollHeader);

                /*==================== SHOW SCROLL UP ====================*/
                function scrollUp() {
                    const scrollUp = document.getElementById('scroll-up');
                    if (this.scrollY >= 350) scrollUp.classList.add('show-scroll');
                    else scrollUp.classList.remove('show-scroll');
                }

                window.addEventListener('scroll', scrollUp);

                /*==================== ABOUT TABS ====================*/
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

                /*=============== HEADER TABS =============== */
                const headerTabs = document.querySelectorAll('.nav__link');

                headerTabs.forEach((tab) => {
                    tab.addEventListener('click', () => {
                        headerTabs.forEach((tab) => {
                            tab.classList.remove('active-link');
                        });

                        tab.classList.add('active-link');
                    });
                });

                /*=============== CONTACT FORM =============== */
                const contactForm = document.getElementById('contact-form'),
                contactName = document.getElementById('contact-name'),
                contactEmail = document.getElementById('contact-email'),
                contactSubject = document.getElementById('contact-subject'),
                contactMessage = document.getElementById('contact-message'),
                errorMessage = document.getElementById('error-message');

                const sendEmail = (e) => {
                    e.preventDefault();

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
