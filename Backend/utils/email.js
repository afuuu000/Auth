const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log(`Email sent: ${info.response}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;