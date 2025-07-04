import React, { useState } from 'react';
import '../styles/reset.css';
import logo from '../assets/logo.jpeg';

const ForgotPassword = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Reset instructions sent! Please check your email.');
      } else {
        setError(data.errors?.[0] || 'Failed to send instructions');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`reset-page ${darkMode ? 'dark' : ''}`}>
      <div className="reset-container">
        <img src={logo} alt="App Logo" className="reset-logo" />
        <h2>Forgot Password</h2>
        <p>Enter your email address and we’ll send you a reset link.</p>

        <form className="reset-form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;