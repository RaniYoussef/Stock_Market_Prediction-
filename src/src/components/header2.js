import React from 'react';
import '../styles/header2.css'; // You can reuse your existing Header CSS if you want
import logo2 from '../assets/logo.jpeg'; // Replace with your actual logo path

function Header2({ darkMode, onToggleDarkMode }) {
  return (
    <header className={`navbar ${darkMode ? 'dark' : ''}`}>
      {/* Project Name - Left */}
      <div className="nav-left">
        <h2 className="brand-name">Easy Money</h2>
      </div>

      {/* Centered Logo */}
      <div className="nav-center">
        <img src={logo2} alt="EGSMP Logo" className="logo2" />
      </div>

      {/* Dark Mode Toggle - Right */}
      <div className="nav-right">
        <button className="toggle-theme" onClick={onToggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
      </div>
    </header>
  );
}

export default Header2;
