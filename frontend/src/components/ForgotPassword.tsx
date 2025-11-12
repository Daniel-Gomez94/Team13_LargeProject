import { useState } from 'react';
import ResetPasswordVerify from './ResetPasswordVerify';

function ForgotPassword() {
    const app_name = '159.65.36.255';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'https://' + app_name + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);

    async function handleSubmit(event: any): Promise<void> {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const trimmedEmail = email.trim();

        console.log('🔐 Forgot Password: Starting request for:', trimmedEmail);

        if (!trimmedEmail) {
            setMessage('Please enter your email address');
            setIsLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setMessage('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        const obj = { email: trimmedEmail };
        const js = JSON.stringify(obj);

        try {
            console.log('📧 Sending forgot password request...');
            const response = await fetch(buildPath('api/forgot-password'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);
            const res = JSON.parse(responseText);

            if (res.error && res.error.length > 0) {
                console.error('❌ Error:', res.error);
                setMessage(res.error);
            } else if (res.success) {
                console.log('✅ Reset code sent successfully');
                setMessage('Reset code sent! Check your email.');
                setTimeout(() => {
                    setShowVerification(true);
                }, 1500);
            }
        } catch (error: any) {
            console.error('💥 Forgot password exception:', error);
            setMessage('Failed to send reset code: ' + error.toString());
        } finally {
            setIsLoading(false);
        }
    }

    function handleResetComplete(): void {
        window.location.href = '/';
    }

    // Show verification screen if needed
    if (showVerification) {
        return (
            <ResetPasswordVerify
                email={email}
                onResetComplete={handleResetComplete}
                onBack={() => setShowVerification(false)}
            />
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <div className="auth-icon">🔐</div>
                <h2 className="auth-title">Forgot Password?</h2>
                <p className="auth-subtitle">
                    Enter your email and we'll send you a code to reset your password
                </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
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
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={isLoading}
                >
                    <span className="button-icon">🔑</span>
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>

                {message && (
                    <div className={`auth-message ${message.includes('sent') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="auth-footer">
                <p>Remember your password?</p>
                <a href="/" className="auth-link">
                    <span className="link-icon">⚔️</span>
                    Back to Login
                </a>
            </div>
        </div>
    );
}

export default ForgotPassword;
