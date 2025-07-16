const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendDigestEmail(to, subject, htmlContent) {
  const msg = {
    to, // recipient email
    from: 'hrichamehra11@gmail.com', // your verified sender
    subject,
    html: htmlContent, // HTML formatted email content
    replyTo: 'hrichamehra11@gmail.com',
  };

  try {
    await sgMail.send(msg);
    console.log('📨 Email sent to:', to);
  } catch (error) {
    console.error('❌ Failed to send email:', error.response?.body || error.message);
  }
}

module.exports = sendDigestEmail;