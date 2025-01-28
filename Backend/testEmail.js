require('dotenv').config();
const sendEmail = require('./utils/email'); // Correct path


sendEmail('your-email@gmail.com', 'Test Email', 'This is a test email')
  .then(() => console.log('Email sent successfully'))
  .catch((err) => console.error('Failed to send email:', err));
