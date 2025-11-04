// Test Email Configuration Script
// Run this to verify your email setup is working
// Usage: node test-email.js your-email@example.com

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = process.argv[2];

if (!testEmail) {
    console.error('? Please provide an email address to test');
    console.log('Usage: node test-email.js your-email@example.com');
    process.exit(1);
}

console.log('?? Email Configuration Test\n');
console.log('Email Service:', process.env.EMAIL_SERVICE || 'Not set');
console.log('Email User:', process.env.EMAIL_USER || 'Not set');
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '? Set' : '? Not set');
console.log('\n---\n');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify configuration
console.log('Testing connection...');
transporter.verify(function(error, success) {
    if (error) {
        console.error('? Connection failed:', error.message);
        console.log('\n?? Troubleshooting:');
        console.log('1. Check EMAIL_USER and EMAIL_PASSWORD in .env');
        console.log('2. For Gmail: Use App Password, not regular password');
        console.log('3. Enable 2-Factor Auth and generate App Password');
        console.log('4. Check https://myaccount.google.com/apppasswords');
        process.exit(1);
    } else {
        console.log('? Connection successful!\n');
        
        // Send test email
        console.log('Sending test email to:', testEmail);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: testEmail,
            subject: 'Test Email - Knights Coding Challenge',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a5568;">?? Knights Coding Challenge</h2>
                    <p>This is a test email to verify your email configuration.</p>
                    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #718096;">Test verification code:</p>
                        <h1 style="margin: 10px 0; color: #2d3748; letter-spacing: 5px;">123456</h1>
                    </div>
                    <p style="color: #718096; font-size: 14px;">If you received this email, your email configuration is working correctly! ?</p>
                </div>
            `
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('? Failed to send email:', error.message);
                process.exit(1);
            } else {
                console.log('? Email sent successfully!');
                console.log('Message ID:', info.messageId);
                console.log('\n? Email configuration is working correctly!');
                console.log('Check', testEmail, 'for the test email.');
                process.exit(0);
            }
        });
    }
});
