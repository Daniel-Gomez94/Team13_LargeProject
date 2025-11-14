import { useState } from 'react';

function Login() {

    const app_name = 'codele.xyz'
    function buildPath(route: string): string {
        if (import.meta.env.MODE != 'development') {
            return 'https://' + app_name + ':5000/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const [message, setMessage] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setPassword] = useState('');

    async function doLogin(event: any): Promise<void> {
        event.preventDefault();

        // Trim inputs
        const trimmedEmail = loginEmail.trim();
        const trimmedPassword = loginPassword.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setMessage('Please enter both email and password');
            return;
        }

        var obj = { email: trimmedEmail, password: trimmedPassword };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            
            console.log('Login response received:', res);
            console.log('Response id:', res.id, 'Type:', typeof res.id);

            // Check if login was successful (id exists and is not -1)
            if (!res.id || res.id === -1 || (typeof res.id === 'number' && res.id <= 0)) {
                setMessage('Email/Password combination incorrect');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('Login successful! Redirecting...');
                console.log('Login successful, redirecting to /game');
                setTimeout(() => {
                    window.location.href = '/game';
                }, 500);
            }
        }
        catch (error: any) {
            setMessage('Login failed: ' + error.toString());
            console.error('Login error:', error);
            return;
        }
    };

    function handleSetLoginEmail(e: any): void {
        setLoginEmail(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    return (
        <div id="loginDiv" className="auth-container">
            <div className="auth-header">
                <div className="auth-icon">🏰</div>
                <h2 className="auth-title">Welcome Back, Knight!</h2>
            </div>

            <form onSubmit={doLogin} className="auth-form">
                <div className="form-group">
                    <label htmlFor="loginEmail">
                        <span className="label-icon">📧</span>
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        id="loginEmail" 
                        placeholder="knight@ucf.edu"
                        value={loginEmail}
                        onChange={handleSetLoginEmail}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="loginPassword">
                        <span className="label-icon">🔒</span>
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="loginPassword" 
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={handleSetPassword}
                        required
                    />
                </div>

                <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                    <a href="/forgot-password" className="auth-link" style={{ fontSize: '0.9em' }}>
                        Forgot Password?
                    </a>
                </div>

                <button 
                    type="submit" 
                    id="loginButton" 
                    className="auth-submit-button"
                >
                    <span className="button-icon">⚔️</span>
                    Login
                </button>

                {message && (
                    <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="auth-footer">
                <p>Don't have an account?</p>
                <a href="/register" className="auth-link">
                    <span className="link-icon">✨</span>
                    Register Now
                </a>
            </div>
        </div>
    );
};

export default Login;

