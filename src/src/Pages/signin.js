// src/Pages/signin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signin.css';
import logo from '../assets/logo.jpeg';
import Header2 from '../components/header2.js';

function SignIn({ darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
          const token = data.token;
          if (token) {
            localStorage.setItem('jwt', token);
            navigate('/home');
          } else {
            alert('No token received. Login failed.');
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
      }
    }
  };

  return (
    <div className={`signin-page ${darkMode ? 'dark' : ''}`}>
      <Header2 darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <div className="sipage-container">
        <div className="login-box">
          <img src={logo} alt="Easy Money Logo" className="logo" />
          <h2>Welcome to Easy Money <span>👋</span></h2>
          <p>Please sign in to your account and start your journey</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email or Username</label>
            <input
              type="email"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}

            <div className="forgot-row">
              <a href="/forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="signin-btn">Sign In</button>
          </form>

          <p className="bottom-text">
            New on our platform? <a href="/signup">Create an account</a>
          </p>

          <div className="or-divider">or</div>

          <button className="google-signin-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
