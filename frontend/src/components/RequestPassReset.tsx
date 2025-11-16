import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RequestPassReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  //const { requestPassReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //await requestPassReset(email);
      //navigate('/');
      setIsSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: '0px' }}>Request Password Reset</h2>

      {!isSent ? (
        <div>
            <p style={{ textAlign: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                Enter your email and we'll send a password reset link.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" disabled={loading} style={{display: 'flex', alignItems: 'center', margin: '0 auto'}}>
                {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
      ) : (
        <div>
            <p style={{ textAlign: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
                A password reset link has been sent to your email if it exists.
            </p>
        </div>
      )}
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/login" className='link'><ArrowBackIcon style={{ padding: '3px', verticalAlign: 'middle'}} />Back to Login</Link>
      </p>
    </div>
  );
};

export default RequestPassReset;