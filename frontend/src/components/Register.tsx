import { useState } from 'react';

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

    async function doRegister(event: any): Promise<void> {
        event.preventDefault();

        // Trim inputs
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Validation
        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
            setMessage('All fields are required');
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setMessage('Please enter a valid email address');
            return;
        }

        var obj = { 
            firstName: trimmedFirstName, 
            lastName: trimmedLastName, 
            email: trimmedEmail, 
            password: trimmedPassword 
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/register'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.error && res.error.length > 0) {
                setMessage(res.error);
            }
            else {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        }
        catch (error: any) {
            setMessage('Registration failed: ' + error.toString());
            console.error('Registration error:', error);
        }
    };

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
