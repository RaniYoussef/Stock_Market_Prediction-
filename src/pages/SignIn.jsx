import React, { useState } from 'react';
import '../styles/signinn.css';
import logo from '../assets/logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // 1. Check for empty fields
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    // 2. Email format check (optional but nice)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address.');
      return;
    }

    // 3. Simulate authentication
    if (email !== 'test@example.com' || password !== 'Test123!') {
      toast.error('Invalid email or password.');
      return;
    }

    // 4. Simulate successful login
    toast.success('Login successful!');
    localStorage.setItem('token', 'mock-jwt-token'); // 🔐 Simulate token storage
    navigate('/intro');
// Redirect to dashboard
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>
          Welcome<br />
          To Easy<br />
          Money
        </h1>
      </div>

      <div className="right-section">
        <div className="login-box">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <button type="submit">Sign In</button>
          </form>

          <p>
            Don't Have An Account?{' '}
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
