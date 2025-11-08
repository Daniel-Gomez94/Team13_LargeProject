/**
 * Test Script for SendGrid Email Configuration
 * Run this to verify your SendGrid setup before using the app
 * 
 * Usage: node test-sendgrid.js your-email@example.com
 */

const path = require('path');
const sgMail = require('@sendgrid/mail');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

console.log('=== SendGrid Configuration Test ===\n');
console.log('Environment Variables:');
console.log('  SENDGRID_API_KEY:', SENDGRID_API_KEY ? `${SENDGRID_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('  EMAIL_FROM:', EMAIL_FROM || 'NOT SET');
console.log('');

if (!SENDGRID_API_KEY) {
    console.error('? ERROR: SENDGRID_API_KEY is not set in .env file');
    console.log('\nPlease follow these steps:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your SendGrid API key to .env');
    console.log('3. Run this test again');
    process.exit(1);
}

if (!EMAIL_FROM) {
    console.error('? ERROR: EMAIL_FROM is not set in .env file');
    console.log('\nPlease add your verified sender email to .env');
    process.exit(1);
}

// Get recipient email from command line
const recipientEmail = process.argv[2];
if (!recipientEmail) {
    console.error('? ERROR: No recipient email provided');
    console.log('\nUsage: node test-sendgrid.js your-email@example.com');
    process.exit(1);
}

console.log(`?? Sending test email to: ${recipientEmail}\n`);

// Configure SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

// Create test message
const msg = {
    to: recipientEmail,
    from: EMAIL_FROM,
    subject: 'SendGrid Test - Knights Coding Challenge',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">?? SendGrid Test Email</h2>
            <p>If you're seeing this email, your SendGrid configuration is working correctly!</p>
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #718096;">Test Code:</p>
                <h1 style="margin: 10px 0; color: #2d3748; letter-spacing: 5px;">123456</h1>
            </div>
            <p style="color: #718096; font-size: 14px;">
                Your email service is configured and ready to send password reset codes.
            </p>
        </div>
    `
};

// Send email
sgMail.send(msg)
    .then((response) => {
        console.log('? SUCCESS! Test email sent successfully');
        console.log('   Status Code:', response[0].statusCode);
        console.log('   Message ID:', response[0].headers['x-message-id']);
        console.log('');
        console.log('?? Check your inbox (and spam folder) at:', recipientEmail);
        console.log('');
        console.log('? Your SendGrid configuration is working!');
        console.log('? Password reset emails should now work in your app');
    })
    .catch((error) => {
        console.error('? ERROR: Failed to send test email\n');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        
        if (error.response) {
            console.error('\nSendGrid Response:');
            console.error(JSON.stringify(error.response.body, null, 2));
        }
        
        console.log('\n=== Common Issues ===');
        console.log('1. API Key Invalid: Check your SENDGRID_API_KEY in .env');
        console.log('2. Sender Not Verified: Verify your EMAIL_FROM address in SendGrid');
        console.log('3. Account Suspended: Check your SendGrid account status');
        console.log('4. Over Quota: Free accounts are limited to 100 emails/day');
        console.log('\nFor more help, see: backend/EMAIL_SETUP.md');
        
        process.exit(1);
    });
