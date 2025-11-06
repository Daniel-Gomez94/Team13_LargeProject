# Quick Test Guide - Mobile Email Verification

## How to Test the Registration Flow

### Step 1: Start the Backend
```bash
cd backend
npm start
```
Make sure the backend is running on http://159.65.36.255 or update the API URLs in the mobile code.

### Step 2: Run the Mobile App
```bash
cd mobile
flutter run
```

### Step 3: Test Registration

1. **Open the app** - You'll see the Login page
2. **Click "✨ Register Now"**
3. **Fill in the form**:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `your-email@ucf.edu` (use a real email you can access)
   - Password: `password123`
   - Confirm Password: `password123`
4. **Click "✨ REGISTER"**
   - Should show loading indicator
   - Backend will send email with 6-digit code
   - Should navigate to Verify Email page

### Step 4: Test Email Verification

1. **Check your email** for verification code (6 digits)
2. **Enter the code** in the app
3. **Click "✅ VERIFY EMAIL"**
   - Should show "Email verified successfully!" in green
   - Should auto-navigate to Login page after 2 seconds

### Step 5: Test Resend Code (Optional)

1. On Verify Email page, click "📬 Resend Code"
2. Check email for new code
3. Enter new code and verify

### Step 6: Test Login

1. **Enter your registered email and password**
2. **Click "⚔️ LOGIN"**
   - Should navigate to Leaderboard page
   - Should show "Welcome, Test User!"

## Common Issues & Solutions

### Issue: "Network error. Please check your connection."
**Solution**: 
- Check if backend is running
- Verify API URL is correct (http://159.65.36.255)
- Check if your device/emulator can reach the backend
- For emulator, you may need to use `10.0.2.2` instead of `localhost`

### Issue: "Failed to send verification email"
**Solution**:
- Check backend SendGrid configuration
- Verify SENDGRID_API_KEY in backend/.env
- Verify EMAIL_FROM in backend/.env
- Check backend console for SendGrid errors

### Issue: "Email already registered"
**Solution**:
- This email was already used
- Try a different email
- Or delete the user from database to re-test

### Issue: "Invalid verification code"
**Solution**:
- Check if you entered the code correctly
- Code may have expired (10 minutes timeout)
- Click "Resend Code" to get a new one

### Issue: "Email not verified. Please check your email for the verification code."
**Solution**:
- You tried to login before verifying email
- Go back to your email and complete verification first
- Or request a new verification code

## Testing Different Scenarios

### Test Case 1: Invalid Password
- Enter password less than 6 characters
- Should show: "Password must be at least 6 characters"

### Test Case 2: Mismatched Passwords
- Enter different values for Password and Confirm Password
- Should show: "Passwords do not match"

### Test Case 3: Empty Fields
- Leave any field empty
- Should show: "All fields are required"

### Test Case 4: Expired Code
- Wait more than 10 minutes after registration
- Try to verify with old code
- Should show: "Verification code has expired. Please register again."
- Solution: Click "Resend Code"

### Test Case 5: Already Registered Email
- Try to register with an email that's already in the system
- Should show: "Email already registered"

## Backend Database Check

To verify registration in MongoDB:

```javascript
// In MongoDB Compass or mongo shell
use LargeProject

// Check unverified users
db.UnverifiedUsers.find({})

// Check verification codes
db.VerificationCodes.find({})

// After verification, check verified users
db.Users.find({})
```

## Debug Tips

### Enable Flutter Debug Logging
```dart
// In each API call, check the console output:
print('Response status: ${response.statusCode}');
print('Response body: ${response.body}');
```

### Check Backend Logs
The backend logs will show:
- Registration attempts with email
- Verification code generation
- Email sending status
- Verification attempts

Look for lines like:
```
=== REGISTRATION REQUEST START ===
✅ Password hashed successfully
✅ Unverified user stored
🔐 Generated verification code: 123456
📧 Attempting to send verification email...
✅ Verification email sent successfully
=== REGISTRATION REQUEST END (SUCCESS) ===
```

## Quick Reset (If Needed)

If you need to completely reset and test again:

```javascript
// In MongoDB
db.UnverifiedUsers.deleteMany({email: "your-email@ucf.edu"})
db.VerificationCodes.deleteMany({Email: "your-email@ucf.edu"})
db.Users.deleteMany({Email: "your-email@ucf.edu"})
```

Then restart the registration flow.
