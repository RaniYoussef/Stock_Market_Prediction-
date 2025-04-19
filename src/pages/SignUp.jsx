import React, { useState } from 'react';
import '../styles/signupp.css';
import logo from '../assets/logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
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

    const { name, email, password } = formData;

    // 1. Required fields check
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address.');
      return;
    }

    // 3. Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    // 4. Simulate email already taken
    if (email === 'taken@example.com') {
      toast.error('Email is already registered.');
      return;
    }

    // 5. Success
    toast.success('Registration successful!');
    console.log('User registered:', formData);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>
          Join<br />
          Easy<br />
          Money
        </h1>
      </div>

      <div className="right-section">
        <div className="login-box">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

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

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already Have An Account?{' '}
            <Link to="/" className="signin-button">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
