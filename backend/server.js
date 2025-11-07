const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//New just added
require('dotenv').config({ path: '/var/largeProjectServer/.env' });


// Salt rounds for bcrypt (higher = more secure but slower)
const SALT_ROUNDS = 10;

// In-memory storage for testing
let users = [
    { UserID: 1, Email: 'test@test.com', Password: 'test', FirstName: 'Test', LastName: 'User', EmailVerified: true },
    { UserID: 2, Email: 'admin@admin.com', Password: 'admin', FirstName: 'Admin', LastName: 'User', EmailVerified: true }
];

let cards = [];
let nextUserId = 3; // For in-memory user ID generation
let verificationCodes = new Map(); // Store verification codes temporarily

// ── .env loader ────────────────────────────────────────────────────────────────
// Load .env from an absolute path so the service finds it no matter where it runs
const path = require('path');
const ENV_PATH = '/var/largeProjectServer/.env';
require('dotenv').config({ path: ENV_PATH });

// Startup diagnostics
console.log('CWD:', process.cwd());
console.log('ENV loaded from:', ENV_PATH);
console.log('SENDGRID key present?', !!process.env.SENDGRID_API_KEY);
console.log('SENDGRID key suffix (server):', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.slice(-8) : '(none)');
console.log('EMAIL_FROM (server):', process.env.EMAIL_FROM);


// SendGrid configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('âœ“ SendGrid API configured');
} else {
    console.log('âš ï¸  SendGrid API key not configured. Email verification will not work.');
    console.log('Please set SENDGRID_API_KEY in your .env file');
}

// Generate a 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email using SendGrid
async function sendVerificationEmail(email, code) {
    if (!SENDGRID_API_KEY || !EMAIL_FROM) {
        console.error('SendGrid not configured. Cannot send email.');
        return false;
    }

    const msg = {
        to: email,
        from: EMAIL_FROM,
        subject: 'Verify Your Email - Knights Coding Challenge',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4a5568;">⚔️ Knights Coding Challenge</h2>
                <p>Thank you for registering! Please verify your email address.</p>
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #718096;">Your verification code is:</p>
                    <h1 style="margin: 10px 0; color: #2d3748; letter-spacing: 5px;">${code}</h1>
                </div>
                <p style="color: #718096; font-size: 14px;">This code will expire in 10 minutes.</p>
                <p style="color: #718096; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
            </div>
        `
    };

    try {
        const [resp] = await sgMail.send(msg);
        console.log('Verification email sent to:', email, 'status:', resp?.statusCode);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid error response:', error.response.body);
        }
        return false;
    }
}


// Send password reset email using SendGrid
async function sendPasswordResetEmail(email, code) {
    if (!SENDGRID_API_KEY || !EMAIL_FROM) {
        console.error('SendGrid not configured. Cannot send email.');
        return false;
    }

    const msg = {
        to: email,
        from: EMAIL_FROM,
        subject: 'Reset Your Password - Knights Coding Challenge',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4a5568;">âš”ï¸ Knights Coding Challenge</h2>
                <p>We received a request to reset your password.</p>
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #718096;">Your password reset code is:</p>
                    <h1 style="margin: 10px 0; color: #2d3748; letter-spacing: 5px;">${code}</h1>
                </div>
                <p style="color: #718096; font-size: 14px;">This code will expire in 15 minutes.</p>
                <p style="color: #718096; font-size: 14px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                <p style="color: #e53e3e; font-size: 14px; font-weight: bold;">ðŸ”’ Never share this code with anyone!</p>
            </div>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        if (error.response) {
            console.error('SendGrid error response:', error.response.body);
        }
        return false;
    }
}

// MongoDB connection
const url = process.env.MONGODB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);

let db;

// Connect to MongoDB
async function connectDB() {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', url ? url.replace(/:[^:@]+@/, ':****@') : 'MISSING');
    
    try {
        await client.connect();
        console.log('âœ“ MongoDB client connected');
        
        db = client.db('LargeProject');
        console.log('âœ“ Database selected: LargeProject');
        
        // Verify connection by pinging
        await db.command({ ping: 1 });
        console.log('âœ“ Database ping successful');
        
        // List collections to verify database access
        const collections = await db.listCollections().toArray();
        console.log('âœ“ Available collections:', collections.map(c => c.name).join(', ') || 'none');
        
        // Count documents
        const userCount = await db.collection('Users').countDocuments();
        const cardCount = await db.collection('Cards').countDocuments();
        console.log(`âœ“ Users: ${userCount}, Cards: ${cardCount}`);
        
    } catch (error) {
        console.error('âœ— MongoDB connection error:');
        console.error('  Error type:', error.name);
        console.error('  Error message:', error.message);
        console.error('  Full error:', error);
        console.log('âœ— Falling back to in-memory storage');
        db = null;
    }
}

connectDB();

// TEST ENDPOINT - Add this to check MongoDB connection status
app.get('/api/test-db', async (req, res) => {
    if (!db) {
        return res.json({ 
            status: 'disconnected', 
            message: 'Not connected to MongoDB',
            usingInMemory: true 
        });
    }
    
    try {
        // Test database connection
        await db.command({ ping: 1 });
        
        // Count documents in collections
        const userCount = await db.collection('Users').countDocuments();
        const cardCount = await db.collection('Cards').countDocuments();
        
        // List all collections
        const collections = await db.listCollections().toArray();
        
        res.json({
            status: 'connected',
            database: 'LargeProject',
            collections: collections.map(c => c.name),
            userCount: userCount,
            cardCount: cardCount,
            message: 'MongoDB connection is working!'
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
});

app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, card
    // outgoing: error

    const { userId, card } = req.body;

    const newCard = { Card: card, UserId: userId };
    var error = '';

    try {
        if (db) {
            // Use MongoDB
            await db.collection('Cards').insertOne(newCard);
        } else {
            // Fallback to in-memory storage
            cards.push(newCard);
            cardList.push(card);
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: email, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { email, password } = req.body;

    // Trim whitespace from inputs
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    let user = null;
    
    try {
        if (db) {
            // Use MongoDB with case-insensitive email search
            user = await db.collection('Users').findOne({ 
                Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }
            });
            
            // Debug logging
            console.log('Login attempt:', { email: trimmedEmail, passwordLength: trimmedPassword?.length });
            console.log('User found:', !!user);
            
            if (user) {
                // Check if email is verified
                if (user.EmailVerified === false) {
                    console.log('Email not verified for user:', trimmedEmail);
                    return res.status(403).json({ 
                        id: -1, 
                        firstName: '', 
                        lastName: '', 
                        error: 'Email not verified. Please check your email for the verification code.' 
                    });
                }

                // Compare password with hashed password
                const passwordMatch = await bcrypt.compare(trimmedPassword, user.Password);
                console.log('Password match:', passwordMatch);
                
                if (!passwordMatch) {
                    user = null; // Invalid password
                }
            }
        } else {
            // Fallback to in-memory users (plain text comparison for legacy data)
            const foundUser = users.find(u => u.Email.toLowerCase() === trimmedEmail);
            if (foundUser) {
                // Check if email is verified (skip for test accounts)
                if (foundUser.EmailVerified === false) {
                    console.log('Email not verified (in-memory):', trimmedEmail);
                    return res.status(403).json({ 
                        id: -1, 
                        firstName: '', 
                        lastName: '', 
                        error: 'Email not verified. Please check your email for the verification code.' 
                    });
                }

                // Check if password is hashed or plain text
                const isHashed = foundUser.Password.startsWith('$2b$') || foundUser.Password.startsWith('$2a$');
                
                if (isHashed) {
                    const passwordMatch = await bcrypt.compare(trimmedPassword, foundUser.Password);
                    if (passwordMatch) {
                        user = foundUser;
                    }
                } else {
                    // Plain text comparison for legacy test users
                    if (foundUser.Password === trimmedPassword) {
                        user = foundUser;
                    }
                }
            }
        }
    } catch (e) {
        error = e.toString();
        console.error('Login error:', error);
    }

    var id = -1;
    var fn = '';
    var ln = '';

    if (user) {
        // Handle both UserID and _id fields, convert to number
        id = user.UserID || user.userId || user._id;
        // Ensure id is a number
        if (typeof id === 'string') {
            id = parseInt(id, 10);
        }
        // If still not a valid number, use the MongoDB _id as string
        if (isNaN(id) || !id) {
            id = user._id ? user._id.toString() : -1;
        }
        fn = user.FirstName || '';
        ln = user.LastName || '';
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: error };
    console.log('Login response:', ret);
    res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => {
    // incoming: firstName, lastName, email, password
    // outgoing: error, requiresVerification

    console.log('=== REGISTRATION REQUEST START ===');
    console.log('Request body:', { ...req.body, password: '***' }); // Hide password
    console.log('Request headers:', req.headers);
    console.log('Request IP:', req.ip);

    var error = '';

    const { firstName, lastName, email, password } = req.body;

    // Trim inputs
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    console.log('Trimmed values:', { 
        firstName: trimmedFirstName, 
        lastName: trimmedLastName, 
        email: trimmedEmail, 
        passwordLength: trimmedPassword?.length 
    });

    // Validation
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword) {
        console.log('âŒ Validation failed: Missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Password strength validation (optional but recommended)
    if (trimmedPassword.length < 6) {
        console.log('âŒ Validation failed: Password too short');
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        console.log('â³ Hashing password...');
        // Hash the password
        const hashedPassword = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);
        console.log('âœ… Password hashed successfully');
        
        if (db) {
            console.log('ðŸ“Š Using MongoDB');
            // Check if email already exists in MongoDB (case-insensitive)
            const existingUser = await db.collection('Users').findOne({ 
                Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } 
            });
            
            if (existingUser) {
                console.log('âŒ Email already exists:', trimmedEmail);
                return res.status(400).json({ error: 'Email already registered' });
            }

            console.log('âœ… Email available');

            // Get the next UserID - ensure it's a number
            const lastUser = await db.collection('Users').find().sort({ UserID: -1 }).limit(1).toArray();
            let newUserId = 1;
            if (lastUser.length > 0 && lastUser[0].UserID) {
                newUserId = parseInt(lastUser[0].UserID, 10) + 1;
                // If lastUser UserID is NaN, start from 1
                if (isNaN(newUserId)) {
                    const allUsers = await db.collection('Users').find().toArray();
                    newUserId = allUsers.length + 1;
                }
            }

            console.log('ðŸ“ New UserID:', newUserId);

            // Create new user - ensure UserID is a number
            const newUser = {
                UserID: Number(newUserId),
                FirstName: trimmedFirstName,
                LastName: trimmedLastName,
                Email: trimmedEmail,
                Password: hashedPassword,  // Store hashed password
                EmailVerified: false,  // Not verified yet
                CreatedAt: new Date()
            };

            console.log('ðŸ’¾ Storing unverified user...');
            // Store user temporarily (will be activated after verification)
            await db.collection('UnverifiedUsers').insertOne(newUser);
            console.log('âœ… Unverified user stored');
            
            // Generate and send verification code
            const verificationCode = generateVerificationCode();
            const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            
            console.log('ðŸ” Generated verification code:', verificationCode);
            console.log('â° Code expires at:', codeExpiry);

            await db.collection('VerificationCodes').insertOne({
                Email: trimmedEmail,
                Code: verificationCode,
                ExpiresAt: codeExpiry,
                CreatedAt: new Date()
            });
            console.log('âœ… Verification code stored');

            // Send verification email
            console.log('ðŸ“§ Attempting to send verification email...');
            const emailSent = await sendVerificationEmail(trimmedEmail, verificationCode);
            
            if (!emailSent) {
                console.log('âŒ Email sending failed - cleaning up...');
                // Clean up if email fails
                await db.collection('UnverifiedUsers').deleteOne({ Email: trimmedEmail });
                await db.collection('VerificationCodes').deleteOne({ Email: trimmedEmail });
                return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
            }

            console.log('âœ… Verification email sent successfully');
            console.log('User registered (pending verification):', { email: trimmedEmail, userId: newUserId });
            console.log('=== REGISTRATION REQUEST END (SUCCESS) ===');
            return res.status(200).json({ error: '', requiresVerification: true });
        } else {
            console.log('ðŸ’¾ Using in-memory storage');
            // Check if email already exists in in-memory storage
            const existingUser = users.find(user => user.Email.toLowerCase() === trimmedEmail);
            if (existingUser) {
                console.log('âŒ Email already exists (in-memory):', trimmedEmail);
                return res.status(400).json({ error: 'Email already registered' });
            }

            // For in-memory storage, generate and store verification code
            const verificationCode = generateVerificationCode();
            const codeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
            
            console.log('ðŸ” Generated verification code (in-memory):', verificationCode);

            verificationCodes.set(trimmedEmail, {
                code: verificationCode,
                expiry: codeExpiry,
                userData: {
                    UserID: nextUserId++,
                    FirstName: trimmedFirstName,
                    LastName: trimmedLastName,
                    Email: trimmedEmail,
                    Password: hashedPassword,
                    EmailVerified: false
                }
            });

            // Send verification email
            console.log('ðŸ“§ Attempting to send verification email (in-memory)...');
            const emailSent = await sendVerificationEmail(trimmedEmail, verificationCode);
            
            if (!emailSent) {
                console.log('âŒ Email sending failed (in-memory) - cleaning up...');
                verificationCodes.delete(trimmedEmail);
                return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
            }

            console.log('âœ… Verification email sent successfully (in-memory)');
            console.log('User registered (pending verification, in-memory):', { email: trimmedEmail });
            console.log('=== REGISTRATION REQUEST END (SUCCESS) ===');
            return res.status(200).json({ error: '', requiresVerification: true });
        }
    } catch (e) {
        error = e.toString();
        console.error('ðŸ’¥ Registration error:', error);
        console.error('Error stack:', e.stack);
        console.log('=== REGISTRATION REQUEST END (ERROR) ===');
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/verify-email', async (req, res, next) => {
    // incoming: email, code
    // outgoing: error, success

    var error = '';
    const { email, code } = req.body;

    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedCode = code?.trim();

    if (!trimmedEmail || !trimmedCode) {
        return res.status(400).json({ error: 'Email and verification code are required' });
    }

    try {
        if (db) {
            // Find verification code
            const verification = await db.collection('VerificationCodes').findOne({
                Email: trimmedEmail,
                Code: trimmedCode
            });

            if (!verification) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }

            // Check if code is expired
            if (new Date() > verification.ExpiresAt) {
                await db.collection('VerificationCodes').deleteOne({ Email: trimmedEmail });
                await db.collection('UnverifiedUsers').deleteOne({ Email: trimmedEmail });
                return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
            }

            // Find unverified user
            const unverifiedUser = await db.collection('UnverifiedUsers').findOne({ Email: trimmedEmail });
            
            if (!unverifiedUser) {
                return res.status(400).json({ error: 'User not found. Please register again.' });
            }

            // Move user to verified Users collection
            const verifiedUser = {
                ...unverifiedUser,
                EmailVerified: true,
                VerifiedAt: new Date()
            };
            delete verifiedUser._id; // Remove _id to get a new one

            await db.collection('Users').insertOne(verifiedUser);
            
            // Clean up
            await db.collection('VerificationCodes').deleteOne({ Email: trimmedEmail });
            await db.collection('UnverifiedUsers').deleteOne({ Email: trimmedEmail });

            console.log('Email verified for user:', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        } else {
            // In-memory verification
            const verification = verificationCodes.get(trimmedEmail);
            
            if (!verification) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }

            if (verification.code !== trimmedCode) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }

            if (Date.now() > verification.expiry) {
                verificationCodes.delete(trimmedEmail);
                return res.status(400).json({ error: 'Verification code has expired. Please register again.' });
            }

            // Add user to users array
            const verifiedUser = {
                ...verification.userData,
                EmailVerified: true
            };
            users.push(verifiedUser);
            
            // Clean up verification code
            verificationCodes.delete(trimmedEmail);

            console.log('Email verified (in-memory):', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        }
    } catch (e) {
        error = e.toString();
        console.error('Email verification error:', error);
        return res.status(500).json({ error: error });
    }
});

app.post('/api/resend-verification', async (req, res, next) => {
    // incoming: email
    // outgoing: error, success

    var error = '';
    const { email } = req.body;

    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        if (db) {
            // Check if user exists in unverified users
            const unverifiedUser = await db.collection('UnverifiedUsers').findOne({ Email: trimmedEmail });
            
            if (!unverifiedUser) {
                return res.status(400).json({ error: 'No pending verification found for this email' });
            }

            // Delete old verification code
            await db.collection('VerificationCodes').deleteOne({ Email: trimmedEmail });

            // Generate new verification code
            const verificationCode = generateVerificationCode();
            const codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            
            await db.collection('VerificationCodes').insertOne({
                Email: trimmedEmail,
                Code: verificationCode,
                ExpiresAt: codeExpiry,
                CreatedAt: new Date()
            });

            // Send verification email
            const emailSent = await sendVerificationEmail(trimmedEmail, verificationCode);
            
            if (!emailSent) {
                return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
            }

            console.log('Verification code resent to:', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        } else {
            // In-memory
            const verification = verificationCodes.get(trimmedEmail);
            
            if (!verification) {
                return res.status(400).json({ error: 'No pending verification found for this email' });
            }

            // Generate new code
            const verificationCode = generateVerificationCode();
            const codeExpiry = Date.now() + 10 * 60 * 1000;
            
            verification.code = verificationCode;
            verification.expiry = codeExpiry;

            // Send verification email
            const emailSent = await sendVerificationEmail(trimmedEmail, verificationCode);
            
            if (!emailSent) {
                return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
            }

            console.log('Verification code resent (in-memory):', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        }
    } catch (e) {
        error = e.toString();
        console.error('Resend verification error:', error);
        return res.status(500).json({ error: error });
    }
});

app.post('/api/forgot-password', async (req, res, next) => {
    // incoming: email
    // outgoing: error, success

    console.log('=== FORGOT PASSWORD REQUEST START ===');
    console.log('Request body:', req.body);

    var error = '';
    const { email } = req.body;

    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
        console.log('âŒ Validation failed: Email is required');
        return res.status(400).json({ error: 'Email is required' });
    }

    console.log('ðŸ“§ Processing forgot password for:', trimmedEmail);

    try {
        if (db) {
            console.log('ðŸ“Š Using MongoDB');
            // Check if user exists
            const user = await db.collection('Users').findOne({
                Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }
            });

            if (!user) {
                console.log('âŒ User not found:', trimmedEmail);
                return res.status(404).json({ error: 'No account found with this email address' });
            }

            console.log('âœ… User found:', user.Email);

            // Delete any existing password reset codes for this email
            const deleteResult = await db.collection('PasswordResetCodes').deleteMany({ Email: trimmedEmail });
            console.log('ðŸ—‘ï¸ Deleted old reset codes:', deleteResult.deletedCount);

            // Generate password reset code
            const resetCode = generateVerificationCode();
            const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            console.log('ðŸ” Generated reset code:', resetCode);
            console.log('â° Code expires at:', codeExpiry);

            await db.collection('PasswordResetCodes').insertOne({
                Email: trimmedEmail,
                Code: resetCode,
                ExpiresAt: codeExpiry,
                CreatedAt: new Date()
            });
            console.log('âœ… Reset code stored in database');

            // Send password reset email
            console.log('ðŸ“§ Attempting to send password reset email...');
            const emailSent = await sendPasswordResetEmail(trimmedEmail, resetCode);

            if (!emailSent) {
                console.log('âŒ Email sending failed');
                return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
            }

            console.log('âœ… Password reset email sent successfully');
            console.log('=== FORGOT PASSWORD REQUEST END (SUCCESS) ===');
            return res.status(200).json({ error: '', success: true });
        } else {
            console.log('ðŸ’¾ Using in-memory storage');
            // In-memory
            const user = users.find(u => u.Email.toLowerCase() === trimmedEmail);

            if (!user) {
                console.log('âŒ User not found (in-memory):', trimmedEmail);
                return res.status(404).json({ error: 'No account found with this email address' });
            }

            console.log('âœ… User found (in-memory):', user.Email);

            // Generate reset code
            const resetCode = generateVerificationCode();
            const codeExpiry = Date.now() + 15 * 60 * 1000;

            console.log('ðŸ” Generated reset code (in-memory):', resetCode);

            // Store in verification codes map with special prefix
            verificationCodes.set('reset_' + trimmedEmail, {
                code: resetCode,
                expiry: codeExpiry,
                email: trimmedEmail
            });
            console.log('âœ… Reset code stored in memory');

            // Send password reset email
            console.log('ðŸ“§ Attempting to send password reset email (in-memory)...');
            const emailSent = await sendPasswordResetEmail(trimmedEmail, resetCode);

            if (!emailSent) {
                console.log('âŒ Email sending failed (in-memory)');
                return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
            }

            console.log('âœ… Password reset email sent successfully (in-memory)');
            console.log('=== FORGOT PASSWORD REQUEST END (SUCCESS) ===');
            return res.status(200).json({ error: '', success: true });
        }
    } catch (e) {
        error = e.toString();
        console.error('ðŸ’¥ Forgot password error:', error);
        console.error('Error stack:', e.stack);
        console.log('=== FORGOT PASSWORD REQUEST END (ERROR) ===');
        return res.status(500).json({ error: error });
    }
});

app.post('/api/reset-password', async (req, res, next) => {
    // incoming: email, code, newPassword
    // outgoing: error, success

    var error = '';
    const { email, code, newPassword } = req.body;

    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedCode = code?.trim();
    const trimmedPassword = newPassword?.trim();

    if (!trimmedEmail || !trimmedCode || !trimmedPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (trimmedPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        if (db) {
            // Find password reset code
            const resetRecord = await db.collection('PasswordResetCodes').findOne({
                Email: trimmedEmail,
                Code: trimmedCode
            });

            if (!resetRecord) {
                return res.status(400).json({ error: 'Invalid or expired reset code' });
            }

            // Check if code is expired
            if (new Date() > resetRecord.ExpiresAt) {
                await db.collection('PasswordResetCodes').deleteOne({ Email: trimmedEmail });
                return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);

            // Update user password
            const result = await db.collection('Users').updateOne(
                { Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } },
                { $set: { Password: hashedPassword, UpdatedAt: new Date() } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Clean up reset code
            await db.collection('PasswordResetCodes').deleteOne({ Email: trimmedEmail });

            console.log('Password reset successfully for:', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        } else {
            // In-memory
            const resetData = verificationCodes.get('reset_' + trimmedEmail);

            if (!resetData) {
                return res.status(400).json({ error: 'Invalid or expired reset code' });
            }

            if (resetData.code !== trimmedCode) {
                return res.status(400).json({ error: 'Invalid reset code' });
            }

            if (Date.now() > resetData.expiry) {
                verificationCodes.delete('reset_' + trimmedEmail);
                return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
            }

            // Find and update user
            const userIndex = users.findIndex(u => u.Email.toLowerCase() === trimmedEmail);

            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);
            users[userIndex].Password = hashedPassword;

            // Clean up reset code
            verificationCodes.delete('reset_' + trimmedEmail);

            console.log('Password reset successfully (in-memory):', trimmedEmail);
            return res.status(200).json({ error: '', success: true });
        }
    } catch (e) {
        error = e.toString();
        console.error('Reset password error:', error);
        return res.status(500).json({ error: error });
    }
});

app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search } = req.body;

    var _search = search.trim();

    var _ret = [];

    try {
        if (db) {
            // Use MongoDB
            const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();
            for (var i = 0; i < results.length; i++) {
                _ret.push(results[i].Card);
            }
        } else {
            // Fallback to in-memory storage
            const results = cards.filter(card =>
                card.Card.toLowerCase().includes(_search.toLowerCase())
            );

            // Also search the initial cardList
            const cardListResults = cardList.filter(card =>
                card.toLowerCase().includes(_search.toLowerCase())
            );

            // Add results from cards array
            for (var i = 0; i < results.length; i++) {
                _ret.push(results[i].Card);
            }

            // Add results from cardList (avoiding duplicates)
            for (var i = 0; i < cardListResults.length; i++) {
                if (!_ret.includes(cardListResults[i])) {
                    _ret.push(cardListResults[i]);
                }
            }
        }
    } catch (e) {
        error = e.toString();
    }

    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.post('/api/completechallenge', async (req, res, next) => {
    // incoming: userId, challengeId, date, attempts, score
    // outgoing: error

    var error = '';
    const { userId, challengeId, date, attempts, score } = req.body;

    // Convert userId to number for consistency
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const completion = { 
        UserId: userIdNum, 
        ChallengeId: challengeId, 
        Date: date,
        Attempts: attempts || 1,
        Score: score || 0,
        CompletedAt: new Date()
    };

    try {
        if (db) {
            // Check if already completed today
            const existing = await db.collection('Completions').findOne({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            });

            if (existing) {
                console.log('Challenge already completed today for user:', userId);
                return res.status(400).json({ error: 'Challenge already completed today' });
            }

            // Use MongoDB
            await db.collection('Completions').insertOne(completion);
            console.log('Challenge completion saved:', completion);
        } else {
            // For in-memory, we don't need to store this
            console.log('Challenge completed (in-memory):', completion);
        }
    } catch (e) {
        error = e.toString();
        console.error('Error saving completion:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/recordattempt', async (req, res, next) => {
    // incoming: userId, challengeId, date, attemptNumber, passed
    // outgoing: error

    var error = '';
    const { userId, challengeId, date, attemptNumber, passed } = req.body;

    // Convert userId to number for consistency
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const attempt = {
        UserId: userIdNum,
        ChallengeId: challengeId,
        Date: date,
        AttemptNumber: attemptNumber,
        Passed: passed,
        Timestamp: new Date()
    };

    try {
        if (db) {
            await db.collection('Attempts').insertOne(attempt);
            console.log('Attempt recorded:', attempt);
        } else {
            console.log('Attempt recorded (in-memory):', attempt);
        }
    } catch (e) {
        error = e.toString();
        console.error('Error recording attempt:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.get('/api/gettodayattempts/:userId/:date', async (req, res, next) => {
    // Get number of attempts for today's challenge
    var error = '';
    const { userId, date } = req.params;

    try {
        if (db) {
            // Convert userId to number for consistency
            const userIdNum = parseInt(userId, 10);
            
            // Check if user completed the challenge today
            const completion = await db.collection('Completions').findOne({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            });

            // If completed, return the stored attempt count from completion record
            if (completion) {
                console.log('User completed challenge. Attempts from completion:', completion.Attempts);
                res.status(200).json({ 
                    attempts: completion.Attempts || 1,
                    completed: true,
                    score: completion.Score || 0,
                    error: '' 
                });
                return;
            }

            // Otherwise, check the attempts collection
            const attempts = await db.collection('Attempts').find({
                UserId: { $in: [userId, userIdNum] },
                Date: date
            }).toArray();

            console.log('Checking attempts for user:', userId, 'date:', date);
            console.log('Found attempts:', attempts.length);

            res.status(200).json({ 
                attempts: attempts.length,
                completed: false,
                error: '' 
            });
        } else {
            res.status(200).json({ attempts: 0, completed: false, error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Error in gettodayattempts:', error);
        res.status(500).json({ attempts: 0, completed: false, error: error });
    }
});

app.get('/api/leaderboard/score', async (req, res, next) => {
    // Get leaderboard by total score
    var error = '';

    try {
        if (db) {
            const leaderboard = await db.collection('Completions').aggregate([
                {
                    $group: {
                        _id: '$UserId',
                        totalScore: { $sum: '$Score' },
                        totalCompletions: { $count: {} }
                    }
                },
                {
                    $sort: { totalScore: -1 }
                },
                {
                    $limit: 10
                }
            ]).toArray();

            // Get user details for each entry
            const leaderboardWithUsers = await Promise.all(
                leaderboard.map(async (entry) => {
                    const user = await db.collection('Users').findOne({ 
                        UserID: entry._id 
                    });
                    return {
                        userId: entry._id,
                        firstName: user?.FirstName || 'Unknown',
                        lastName: user?.LastName || 'User',
                        totalScore: entry.totalScore,
                        totalCompletions: entry.totalCompletions
                    };
                })
            );

            res.status(200).json({ leaderboard: leaderboardWithUsers, error: '' });
        } else {
            res.status(200).json({ leaderboard: [], error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Leaderboard error:', error);
        res.status(500).json({ leaderboard: [], error: error });
    }
});

app.get('/api/leaderboard/streak', async (req, res, next) => {
    // Get leaderboard by longest streak
    var error = '';

    try {
        if (db) {
            // Get all completions sorted by user and date
            const allCompletions = await db.collection('Completions').find()
                .sort({ UserId: 1, Date: 1 })
                .toArray();

            // Calculate streaks for each user
            const userStreaks = new Map();

            allCompletions.forEach(completion => {
                if (!userStreaks.has(completion.UserId)) {
                    userStreaks.set(completion.UserId, {
                        currentStreak: 0,
                        longestStreak: 0,
                        lastDate: null,
                        dates: []
                    });
                }

                const userData = userStreaks.get(completion.UserId);
                userData.dates.push(new Date(completion.Date));
            });

            // Calculate streaks
            const streakData = [];
            for (const [userId, data] of userStreaks) {
                let currentStreak = 0;
                let longestStreak = 0;
                let prevDate = null;

                data.dates.sort((a, b) => a - b);

                for (const date of data.dates) {
                    if (prevDate) {
                        const diffDays = Math.floor((date - prevDate) / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                            currentStreak++;
                        } else if (diffDays > 1) {
                            longestStreak = Math.max(longestStreak, currentStreak);
                            currentStreak = 1;
                        }
                    } else {
                        currentStreak = 1;
                    }
                    prevDate = date;
                }
                longestStreak = Math.max(longestStreak, currentStreak);

                const user = await db.collection('Users').findOne({ UserID: userId });
                streakData.push({
                    userId: userId,
                    firstName: user?.FirstName || 'Unknown',
                    lastName: user?.LastName || 'User',
                    longestStreak: longestStreak,
                    currentStreak: currentStreak
                });
            }

            streakData.sort((a, b) => b.longestStreak - a.longestStreak);
            const topStreaks = streakData.slice(0, 10);

            res.status(200).json({ leaderboard: topStreaks, error: '' });
        } else {
            res.status(200).json({ leaderboard: [], error: '' });
        }
    } catch (e) {
        error = e.toString();
        console.error('Streak leaderboard error:', error);
        res.status(500).json({ leaderboard: [], error: error });
    }
});

app.post('/api/updateaccount', async (req, res, next) => {
    // incoming: userId, email (optional), password (optional)
    // outgoing: error

    var error = '';
    const { userId, email, password } = req.body;

    // Validation
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!email && !password) {
        return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    try {
        if (db) {
            const updateFields = {};
            
            if (email) {
                const trimmedEmail = email.trim().toLowerCase();
                
                // Check if email is already taken by another user
                const existingUser = await db.collection('Users').findOne({
                    Email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') },
                    UserID: { $ne: userId }
                });
                
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use by another account' });
                }
                
                updateFields.Email = trimmedEmail;
            }
            
            if (password) {
                const trimmedPassword = password.trim();
                
                // Password strength validation
                if (trimmedPassword.length < 6) {
                    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
                }
                
                // Hash the new password
                updateFields.Password = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);
            }

            // Update user in MongoDB
            const result = await db.collection('Users').updateOne(
                { UserID: userId },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            console.log('Account updated for user:', userId);
        } else {
            // Update in-memory storage
            const userIndex = users.findIndex(u => u.UserID === userId);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (email) {
                const trimmedEmail = email.trim().toLowerCase();
                
                // Check if email is already taken
                const existingUser = users.find(u => 
                    u.Email.toLowerCase() === trimmedEmail && u.UserID !== userId
                );
                
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use by another account' });
                }
                
                users[userIndex].Email = trimmedEmail;
            }
            
            if (password) {
                const trimmedPassword = password.trim();
                
                // Password strength validation
                if (trimmedPassword.length < 6) {
                    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
                }
                
                // Hash the new password
                users[userIndex].Password = await bcrypt.hash(trimmedPassword, SALT_ROUNDS);
            }
        }
    } catch (e) {
        error = e.toString();
        console.error('Update account error:', error);
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

console.log('Server starting on port 5000...');
console.log('Test credentials: email=test@test.com, password=test');

app.listen(5000); // start Node + Express server on port 5000
