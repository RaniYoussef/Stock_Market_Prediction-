import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpeg';
import avatar from '../assets/avatar.jpeg';
import '../styles/Header.css';

const Header = ({ darkMode, onToggleDarkMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/signin');
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={darkMode ? "navbar dark" : "navbar"}
      >
        <div className="nav-left">
          <img src={logo} alt="App Logo" className="logo" />
          <h2 className="brand-name">Easy Money</h2>
        </div>
        <div className="nav-right">
          <a href="/Home">Home</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <button className="toggle-theme" onClick={onToggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="profile-container" ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <div className="profile-info">
              <span className="profile-name">Demo Profile</span>
              <span className="profile-balance">5,000,000 EGP</span>
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-arrow" />
                  <a href="/Profile">View Profile</a>
                  <div className="dropdown-divider" />
                  <a
                    className="logout-link"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    Log Out
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={`modal-overlay ${darkMode ? 'dark' : ''}`}>
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogout}>Yes, Log Out</button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
