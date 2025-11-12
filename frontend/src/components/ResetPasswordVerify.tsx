import { useState } from 'react';

interface ResetPasswordVerifyProps {
    email: string;
    onResetComplete: () => void;
    onBack: () => void;
}

function ResetPasswordVerify({ email, onResetComplete, onBack }: ResetPasswordVerifyProps) {
    const app_name = '159.65.36.255';
    
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'https://' + app_name + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: any): Promise<void> {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const trimmedCode = resetCode.trim();
        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Validation
        if (!trimmedCode) {
            setMessage('Please enter the reset code');
            setIsLoading(false);
            return;
        }

        if (trimmedCode.length !== 6) {
            setMessage('Reset code must be 6 digits');
            setIsLoading(false);
            return;
        }

        if (!trimmedNewPassword || !trimmedConfirmPassword) {
            setMessage('Please enter and confirm your new password');
            setIsLoading(false);
            return;
        }

        if (trimmedNewPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (trimmedNewPassword !== trimmedConfirmPassword) {
            setMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const obj = {
            email: email,
            code: trimmedCode,
            newPassword: trimmedNewPassword
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/reset-password'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = JSON.parse(await response.text());

            if (res.error && res.error.length > 0) {
                setMessage(res.error);
            } else if (res.success) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    onResetComplete();
                }, 2000);
            }
        } catch (error: any) {
            setMessage('Password reset failed: ' + error.toString());
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function resendCode(): Promise<void> {
        setIsLoading(true);
        setMessage('');

        const obj = { email: email };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/forgot-password'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = JSON.parse(await response.text());

            if (res.error && res.error.length > 0) {
                setMessage(res.error);
            } else if (res.success) {
                setMessage('Reset code resent! Check your email.');
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
                <div className="auth-icon">🔐</div>
                <h2 className="auth-title">Reset Your Password</h2>
                <p className="auth-subtitle">
                    Enter the code sent to <strong>{email}</strong> and your new password
                </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="resetCode">
                        <span className="label-icon">🔢</span>
                        Reset Code
                    </label>
                    <input
                        type="text"
                        id="resetCode"
                        placeholder="Enter 6-digit code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        required
                        disabled={isLoading}
                        style={{ letterSpacing: '0.5em', fontSize: '1.2em', textAlign: 'center' }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">
                        <span className="label-icon">🔒</span>
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">
                        <span className="label-icon">🔒</span>
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={isLoading}
                >
                    <span className="button-icon">✅</span>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
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
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordVerify;
