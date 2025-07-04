import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loading.css';
import logo from '../assets/logo.jpeg';
import Header2 from '../components/header2';

function Loading({ darkMode, setDarkMode }) {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/signin'), 800);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={`loading-wrapper ${darkMode ? 'dark' : ''}`}>
      <Header2 darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="loading-page">
        <div className="intro-container">
          <div className="logo-placeholder">
            <img src={logo} alt="Easy Money Logo" className="logo-image" />
          </div>

          <h1 className="title fancy-title">
            {"Welcome to Easy Money".split('').map((char, index) => (
              <span
                key={index}
                className={`animated-char ${char === ' ' ? 'space' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </h1>

          <p className="tagline">Smart Investments, Simple Steps.</p>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <p className="loading-text">
            Loading<span className="dots"><span>.</span><span>.</span><span>.</span></span>
          </p>

          <footer className="footer">© 2025 Easy Money. All rights reserved.</footer>
        </div>
      </div>
    </div>
  );
}

export default Loading;
