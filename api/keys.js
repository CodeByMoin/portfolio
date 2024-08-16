export default function handler(req, res) {
    const emailjs_serviceID = process.env.emailjs_serviceID;
    const emailjs_templateID = process.env.emailjs_templateID;
    const emailjs_publickey = process.env.emailjs_publickey;
    
    res.status(200).json({ emailjs_serviceID, emailjs_templateID, emailjs_publickey });
  }