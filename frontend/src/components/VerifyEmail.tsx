import { useState } from 'react';

interface VerifyEmailProps {
    email: string;
    onVerificationComplete: () => void;
    onBack: () => void;
}

function VerifyEmail({ email, onVerificationComplete, onBack }: VerifyEmailProps) {
    const app_name = 'codele.xyz';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') { 
            return 'https://' + app_name + '/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function verifyEmail(event: any): Promise<void> {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const trimmedCode = verificationCode.trim();

        if (!trimmedCode) {
            setMessage('Please enter the verification code');
            setIsLoading(false);
            return;
        }

        if (trimmedCode.length !== 6) {
            setMessage('Verification code must be 6 digits');
            setIsLoading(false);
            return;
        }

        var obj = { email: email, code: trimmedCode };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/verify-email'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            var res = JSON.parse(await response.text());

            if (res.error && res.error.length > 0) {
                setMessage(res.error);
            } else if (res.success) {
                setMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    onVerificationComplete();
                }, 2000);
            }
        } catch (error: any) {
            setMessage('Verification failed: ' + error.toString());
            console.error('Verification error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function resendCode(): Promise<void> {
        setIsLoading(true);
        setMessage('');

        var obj = { email: email };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/resend-verification'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            var res = JSON.parse(await response.text());

            if (res.error && res.error.length > 0) {  
                setMessage(res.error);
            } else if (res.success) {
                setMessage('Verification code resent! Check your email.');
            }
        } catch (error: any) {
            setMessage('Failed to resend code: ' + error.toString());
            console.error('Resend error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <div className="auth-icon">📧</div>
                <h2 className="auth-title">Verify Your Email</h2>
                <p className="auth-subtitle">
                    We've sent a 6-digit code to <strong>{email}</strong>
                </p>
            </div>

            <form onSubmit={verifyEmail} className="auth-form">
                <div className="form-group">
                    <label htmlFor="verificationCode">
                        <span className="label-icon">🔢</span>
                        Verification Code
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        required
                        disabled={isLoading}
                        style={{ letterSpacing: '0.5em', fontSize: '1.2em', textAlign: 'center' }}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={isLoading}
                >
                    <span className="button-icon">✅</span>
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>

                {message && (
                    <div className={`auth-message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="auth-footer">
                <p>Didn't receive the code?</p>
                <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={resendCode}
                        className="auth-link"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '5px 10px'
                        }}
                        disabled={isLoading}
                    >
                        <span className="link-icon">📧</span>
                        Resend Code
                    </button>
                    <button
                        onClick={onBack}
                        className="auth-link"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '5px 10px'
                        }}
                        disabled={isLoading}
                    >
                        <span className="link-icon">↩️</span>
                        Back to Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
