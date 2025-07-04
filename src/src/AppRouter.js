import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Pages/App.js';
import AboutUs from './Pages/AboutUs';
import SignIn from './Pages/signin.js';
import Loading from './Pages/loading.js';
import SignUp from './Pages/signup.js';
import Predict from './Pages/Predict';
import Profile from './Pages/Profile.js';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import ContactUs from './Pages/ContactUs';

import './styles/loading.css';

const AppRouter = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.matches ?? false; 
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/" element={<Loading darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about" element={<AboutUs darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/signin" element={<SignIn darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/home" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/signup" element={<SignUp darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/predict" element={<Predict darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/profile" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/forgot" element={<ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/reset-password" element={<ResetPassword darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/contact" element={<ContactUs darkMode={darkMode} setDarkMode={setDarkMode} />} />

        </Routes>
      </Router>
    </div>
  );
};

export default AppRouter;
