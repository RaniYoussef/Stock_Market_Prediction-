// src/MainApp.js
import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import './styles/App.css';

const MainApp = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <AppRouter darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
};

export default MainApp;
