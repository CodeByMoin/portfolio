// api/send-email.js
import emailjs from 'emailjs-com';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { contactName, contactEmail, contactSubject, contactMessage } = req.body;

        // Send the email using EmailJS
        const response = await emailjs.send(
            process.env.emailjs_serviceID,
            process.env.emailjs_templateID,
            {
                from_name: contactName,
                from_email: contactEmail,
                subject: contactSubject,
                message: contactMessage
            },
            process.env.emailjs_publickey
        );

        res.status(200).json({ success: 'Message sent ✔️', response });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email', details: error });
    }
}
