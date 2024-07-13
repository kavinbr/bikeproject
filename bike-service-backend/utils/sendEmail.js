const nodemailer = require('nodemailer');

const sendEmail = async (from, to, subject, text, credentials) => {
  try {
    console.log(`Sending email from: ${from}, to: ${to}, subject: ${subject}`);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: credentials.user,
        pass: credentials.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 30000,
    });

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

module.exports = sendEmail;
