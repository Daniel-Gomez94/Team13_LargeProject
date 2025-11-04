import { useState } from 'react';
import VerifyEmail from './VerifyEmail';

function Register() {

    const app_name = '159.65.36.255'
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'http://' + app_name + ':5000/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    async function doRegister(event: any): Promise<void> {
        event.preventDefault();

        // Trim inputs
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        console.log('🔍 Registration attempt started');
        console.log('Environment mode:', import.meta.env.MODE);
        console.log('Is development:', import.meta.env.MODE === 'development');

        // Validation
        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
            setMessage('All fields are required');
            console.error('❌ Validation failed: Missing fields');
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setMessage('Passwords do not match');
            console.error('❌ Validation failed: Password mismatch');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setMessage('Please enter a valid email address');
            console.error('❌ Validation failed: Invalid email format');
            return;
        }

        var obj = { 
            firstName: trimmedFirstName, 
            lastName: trimmedLastName, 
            email: trimmedEmail, 
            password: trimmedPassword 
        };
        var js = JSON.stringify(obj);

        const apiUrl = buildPath('api/register');
        console.log('📡 API URL:', apiUrl);
        console.log('📤 Request payload:', { ...obj, password: '***' }); // Hide password in logs

        try {
            console.log('⏳ Sending registration request...');
            const response = await fetch(apiUrl,
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response ok:', response.ok);
            console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('📥 Raw response text:', responseText);

            var res = JSON.parse(responseText);
            console.log('📥 Parsed response:', res);

            if (res.error && res.error.length > 0) {
                console.error('❌ Registration failed:', res.error);
                setMessage(res.error);
            }
            else if (res.requiresVerification) {
                console.log('✅ Registration successful - requires verification');
                setMessage('Registration successful! Check your email for the verification code.');
                setRegisteredEmail(trimmedEmail);
                // Show verification screen after a short delay
                setTimeout(() => {
                    setShowVerification(true);
                }, 1500);
            }
            else {
                console.log('✅ Registration successful - no verification required');
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        }
        catch (error: any) {
            console.error('💥 Registration exception:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            setMessage('Registration failed: ' + error.toString());
        }
    }

    function handleVerificationComplete(): void {
        window.location.href = '/';
    }

    function handleBackToRegister(): void {
        setShowVerification(false);
        setMessage('');
    }

    // Show verification screen if needed
    if (showVerification) {
        return (
            <VerifyEmail 
                email={registeredEmail} 
                onVerificationComplete={handleVerificationComplete}
                onBack={handleBackToRegister}
            />
        );
    }

    return (
        <div id="registerDiv" className="auth-container">
            <div className="auth-header">
                <div className="auth-icon">⚔️</div>
                <h2 className="auth-title">Join the Knights!</h2>
                <p className="auth-subtitle">Create your account to start your coding journey</p>
            </div>

            <form onSubmit={doRegister} className="auth-form">
                <div className="form-group">
                    <label htmlFor="firstName">
                        <span className="label-icon">👤</span>
                        First Name
                    </label>
                    <input 
                        type="text" 
                        id="firstName" 
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">
                        <span className="label-icon">👤</span>
                        Last Name
                    </label>
                    <input 
                        type="text" 
                        id="lastName" 
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">
                        <span className="label-icon">📧</span>
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="knight@ucf.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        <span className="label-icon">🔒</span>
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">
                        <span className="label-icon">🔒</span>
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    id="registerButton" 
                    className="auth-submit-button"
                >
                    <span className="button-icon">✨</span>
                    Register
                </button>

                {message && (
                    <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="auth-footer">
                <p>Already have an account?</p>
                <a href="/" className="auth-link">
                    <span className="link-icon">🔑</span>
                    Log In
                </a>
            </div> 
        </div>
    );
};

export default Register;
