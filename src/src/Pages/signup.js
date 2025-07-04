// src/Pages/signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import logo from '../assets/logo.jpeg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header2 from '../components/header2';

function SignUp({ darkMode, setDarkMode }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+20',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const getPasswordTips = (password) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  });

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{9,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      const tips = getPasswordTips(form.password);
      if (!tips.length || !tips.upper || !tips.number || !tips.special) {
        newErrors.password = 'Password is not strong enough';
      }
    }

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword,
            phone: `${form.countryCode}${form.phone}`,
            balance: 5000000
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Account created successfully!');
          navigate('/signin');
        } else {
          alert(data.message || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
        alert('An error occurred during signup.');
      }
    }
  };

  const tips = getPasswordTips(form.password);

  return (
    <div className={`signup-page ${darkMode ? 'dark' : ''}`}>
      <Header2 darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <div className="supage-container">
        <div className="signup-box">
          <img src={logo} alt="Easy Money Logo" className="logo" />
          <h2>Create an account</h2>
          <p>Join Easy Money and begin your journey!</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label>Phone Number</label>
            <div className="phone-input">
              <select name="countryCode" value={form.countryCode} onChange={handleChange}>
                <option value="+20">🇪🇬 +20</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="123456789"
                className={errors.phone ? 'input-error' : ''}
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}

            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
            <ul className="password-tips">
              <li className={tips.length ? 'valid' : ''}>• At least 8 characters</li>
              <li className={tips.upper ? 'valid' : ''}>• One uppercase letter</li>
              <li className={tips.number ? 'valid' : ''}>• One number</li>
              <li className={tips.special ? 'valid' : ''}>• One special character</li>
            </ul>

            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}

            <button type="submit" className="signup-btn">Sign Up</button>
          </form>

          <p className="bottom-text">
            Already have an account? <a href="/signin">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
