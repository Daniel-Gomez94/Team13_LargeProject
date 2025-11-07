// test-email.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const to = process.argv[2];
if (!to) {
  console.error('Usage: node test-email.js you@example.com');
  process.exit(1);
}

console.log('SENDGRID key suffix:', process.env.SENDGRID_API_KEY?.slice(-8));
console.log('FROM:', process.env.EMAIL_FROM);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

(async () => {
  try {
    const [resp] = await sgMail.send({
      to,                                 
      from: process.env.EMAIL_FROM,
      subject: 'Codele test (SendGrid API)',
      html: '<p>It works ?</p>'
    });
    console.log('Status:', resp.statusCode); // expect 202
  } catch (e) {
    console.error('Send error:', e.response?.body || e.message);
    process.exit(1);
  }
})();
