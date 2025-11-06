# Mobile Registration Flow - Visual Guide

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MOBILE APP REGISTRATION FLOW                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   App Starts     │
│   (main.dart)    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│          LOGIN PAGE (login_page.dart)           │
│  ┌───────────────────────────────────────────┐  │
│  │  🏰                                       │  │
│  │  Welcome Back, Knight!                   │  │
│  │                                           │  │
│  │  📧 EMAIL ADDRESS                        │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  🔒 PASSWORD                             │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  [     ⚔️ LOGIN      ]                  │  │
│  │                                           │  │
│  │  Don't have an account?                  │  │
│  │  [  ✨ Register Now  ] ◄────────────┐   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         │                                    │
         │ Login Success                      │ Click Register
         ▼                                    │
┌─────────────────────┐                       │
│  LEADERBOARD PAGE   │                       │
│  (leaderboard_page) │                       │
│                     │                       │
│  Welcome, User!     │                       │
│  🏆 Top Scores      │                       │
│  🔥 Top Streaks     │                       │
└─────────────────────┘                       │
                                              │
                                              ▼
┌─────────────────────────────────────────────────┐
│       REGISTER PAGE (register_page.dart)        │
│  ┌───────────────────────────────────────────┐  │
│  │  ⚔️                                       │  │
│  │  Join the Knights!                       │  │
│  │                                           │  │
│  │  👤 FIRST NAME                           │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  👤 LAST NAME                            │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  📧 EMAIL ADDRESS                        │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  🔒 PASSWORD                             │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  🔒 CONFIRM PASSWORD                     │  │
│  │  [_________________________]             │  │
│  │                                           │  │
│  │  [    ✨ REGISTER    ]                  │  │
│  │                                           │  │
│  │  Already have an account?                │  │
│  │  [   🔑 Log In   ]                       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         │
         │ Submit Form
         ▼
┌─────────────────────────────────────────────────┐
│         POST /api/register                      │
│  Backend creates unverified user                │
│  Generates 6-digit code                         │
│  Sends email via SendGrid                       │
│  Returns: { requiresVerification: true }        │
└─────────────────────────────────────────────────┘
         │
         │ Success
         ▼
┌─────────────────────────────────────────────────┐
│   VERIFY EMAIL PAGE (verify_email_page.dart)    │
│  ┌───────────────────────────────────────────┐  │
│  │  📧                                       │  │
│  │  Verify Your Email                       │  │
│  │                                           │  │
│  │  We sent a 6-digit code to:              │  │
│  │  user@ucf.edu                            │  │
│  │                                           │  │
│  │  🔢 VERIFICATION CODE                    │  │
│  │  [______  ______  ______]                │  │
│  │                                           │  │
│  │  [  ✅ VERIFY EMAIL  ]                   │  │
│  │                                           │  │
│  │  Didn't receive the code?                │  │
│  │  [  📬 Resend Code  ]                    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         │
         │ Enter Code & Submit
         ▼
┌─────────────────────────────────────────────────┐
│       POST /api/verify-email                    │
│  Backend verifies code                          │
│  Moves user to Users collection                 │
│  Sets EmailVerified = true                      │
│  Returns: { success: true }                     │
└─────────────────────────────────────────────────┘
         │
         │ Success (2 second delay)
         ▼
┌─────────────────────────────────────────────────┐
│          Back to LOGIN PAGE                     │
│  Now user can login with verified email         │
└─────────────────────────────────────────────────┘


═══════════════════════════════════════════════════
              ERROR HANDLING PATHS
═══════════════════════════════════════════════════

REGISTRATION ERRORS:
├─ Empty fields → "All fields are required"
├─ Password < 6 chars → "Password must be at least 6 characters"
├─ Passwords don't match → "Passwords do not match"
├─ Email exists → "Email already registered"
└─ Network error → "Network error. Please check your connection."

VERIFICATION ERRORS:
├─ Empty code → "Please enter the verification code"
├─ Code != 6 digits → "Verification code must be 6 digits"
├─ Invalid code → "Invalid verification code"
├─ Expired code → "Verification code has expired. Please register again."
└─ Network error → "Network error. Please check your connection."

LOGIN ERRORS:
├─ Empty fields → (validation needed)
├─ Invalid credentials → "Invalid email/password" (from backend)
├─ Email not verified → "Email not verified. Please check your email..."
└─ Network error → "Network error. Please check your connection."


═══════════════════════════════════════════════════
                 DATABASE FLOW
═══════════════════════════════════════════════════

REGISTRATION:
┌─────────────────┐      ┌──────────────────────┐
│ UnverifiedUsers │ ◄─── │ User data inserted   │
│   Collection    │      │ EmailVerified: false │
└─────────────────┘      └──────────────────────┘
         │
         └── Email, FirstName, LastName, HashedPassword
         
┌──────────────────┐     ┌──────────────────────┐
│ VerificationCodes│ ◄── │ Code: 6-digit number │
│   Collection     │     │ ExpiresAt: +10 mins  │
└──────────────────┘     └──────────────────────┘

EMAIL VERIFICATION:
┌─────────────────┐      ┌──────────────────────┐
│ UnverifiedUsers │ ───► │ Move to Users        │
│   Collection    │      │ Delete from here     │
└─────────────────┘      └──────────────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ Users Collection │
                         │ EmailVerified:   │
                         │      true        │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────────┐
│ VerificationCodes│ ───►│ Delete code after    │
│   Collection     │     │ successful verify    │
└──────────────────┘     └──────────────────────┘


═══════════════════════════════════════════════════
              API ENDPOINTS SUMMARY
═══════════════════════════════════════════════════

POST /api/register
├─ Body: { firstName, lastName, email, password }
├─ Response: { error, requiresVerification }
└─ Side Effects: Creates UnverifiedUser, sends email

POST /api/verify-email
├─ Body: { email, code }
├─ Response: { error, success }
└─ Side Effects: Moves user to Users collection

POST /api/resend-verification
├─ Body: { email }
├─ Response: { error, success }
└─ Side Effects: Generates new code, sends email

POST /api/login
├─ Body: { email, password }
├─ Response: { id, firstName, lastName, error }
└─ Returns 403 if email not verified


═══════════════════════════════════════════════════
                  FILE STRUCTURE
═══════════════════════════════════════════════════

mobile/lib/
├── main.dart                    (App entry point)
├── pages/
│   ├── login_page.dart         (✓ Modified - Added API call & navigation)
│   ├── register_page.dart      (✓ Modified - Added full registration flow)
│   ├── verify_email_page.dart  (✓ NEW - Email verification UI)
│   └── leaderboard_page.dart   (Existing - No changes)
├── theme/
│   └── app_theme.dart          (Existing - No changes)
└── widgets/
    ├── glow.dart               (Existing - No changes)
    └── gradient.dart           (Existing - No changes)


═══════════════════════════════════════════════════
              KEY FEATURES IMPLEMENTED
═══════════════════════════════════════════════════

✓ Form validation (required fields, password length, password match)
✓ API integration with error handling
✓ Loading states (CircularProgressIndicator)
✓ Success/error message display
✓ Email verification code input (6 digits)
✓ Resend verification code functionality
✓ Navigation flow (Login ↔ Register → Verify → Login)
✓ Animated UI elements (bounce animation)
✓ Consistent theming (gold & black)
✓ User feedback (success/error messages)
✓ Network error handling
✓ Prevent duplicate submissions (disabled buttons during loading)
```
