import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  //const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError('Please enter the code');
      return;
    }

    if(!Number.isInteger(Number(code))){
        setError('Code can only be digits');
        return;
    }

    if(String(code).length !== 6){
        setError('Please enter a 6 digit code');
        return;
    }

    setLoading(true);
    setError('');

    try {
      //await verifyEmail(Number(code));
      //navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: '0px' }}>Verify Your Email</h2>
      <p style={{ textAlign: 'center', paddingTop: '5px', paddingBottom: '5px' }}>
        Please enter the 6 digit verification code sent to your email address.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code"></label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading} style={{display: 'flex', alignItems: 'center', margin: '0 auto'}}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;