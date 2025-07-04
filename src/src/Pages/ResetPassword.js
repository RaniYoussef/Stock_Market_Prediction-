import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/reset.css';
import logo from '../assets/logo.jpeg';

const ResetPassword = ({ darkMode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetTokenFromURL = searchParams.get('token'); // Extract token from URL

  const [resetToken, setResetToken] = useState(resetTokenFromURL || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/password/reset', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_password_token: resetToken,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Password has been reset successfully!');
        setTimeout(() => navigate('/signin?reset=success'), 2000);
      } else {
        setError(data.errors?.[0] || 'Reset failed');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`reset-page ${darkMode ? 'dark' : ''}`}>
      <div className="reset-container">
        <img src={logo} alt="App Logo" className="reset-logo" />
        <h2>Reset Password</h2>
        <p>Enter your new password and confirmation.</p>

        <form className="reset-form" onSubmit={handleReset}>
          {!resetTokenFromURL && (
            <input
              type="text"
              placeholder="Reset Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
