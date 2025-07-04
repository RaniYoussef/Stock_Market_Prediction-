// src/Pages/App.js
import React, { useEffect } from 'react';
import '../styles/App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/header'; 
import homeBck from '../assets/Home-bck.jpg';
import readyImage from '../assets/images/ready.png';
import aiDriven from '../assets/images/aidriven.png';
import realTime from '../assets/images/realtime.png';
import customized from '../assets/images/customized.png';
import expert from '../assets/images/expert.png';
import visa from '../assets/images/visa.png';
import maestro from '../assets/images/maestro.png';
import union from '../assets/images/union.png';
import klarna from '../assets/images/klarna.png';
import apple from '../assets/images/apple.png';
import amazon from '../assets/images/amazon.png';
import paypal from '../assets/images/paypal.png';
import { useNavigate } from 'react-router-dom';

function App({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />

      {/* Main Section */}
      <main className="main-section">
        <div className="main-container">
          <section className="hero" data-aos="fade-up">
            <div className="hero-content" data-aos="fade-right">
              <h1 className="hero-title">
                TRADE LIKE <br />
                <span className="offset-line">A MASTER!</span>
              </h1>
              <button data-aos="zoom-in" onClick={() => navigate('/predict')}>
                Predict Now
              </button>
            </div>
            <div className="chart-image" data-aos="fade-left">
              <img src={homeBck} alt="Home Background Chart" />
            </div>
          </section>

          <section className="info-grid" data-aos="fade-up">
            <div className="info-card">
              <img src="https://img.icons8.com/ios-filled/50/000000/artificial-intelligence.png" alt="AI" />
              <h3>ARTIFICIAL<br />INTELLIGENCE</h3>
            </div>
            <div className="info-card">
              <img src="https://img.icons8.com/ios-filled/50/000000/museum.png" alt="Domain Experts" />
              <h3>DOMAIN<br />EXPERTS</h3>
            </div>
            <div className="info-card">
              <img src="https://img.icons8.com/ios-filled/50/000000/conference-call.png" alt="Broker Assistance" />
              <h3>BROKER<br />ASSISTANCE</h3>
            </div>
            <p className="info-tagline">AI-powered stock predictions for better investing</p>
          </section>

          <section className="ready-section" data-aos="fade-up">
            <div className="ready-container">
              <div className="ready-image">
                <img src={readyImage} alt="AI Chip" />
              </div>
              <div className="ready-text">
                <h2><span className="ready-highlight">|</span> ARE YOU READY ?</h2>
                <p>
                  We provide reliable and expert guidance for all your brokerage needs.
                  Whether you're new to investing or an experienced trader, our platform offers
                  tailored solutions to help you navigate the financial markets with confidence.
                </p>
              </div>
            </div>
          </section>

          <section className="platform-intro" data-aos="fade-up">
            <hr className="intro-line" />
            <p className="intro-description">
              Welcome to the future of stock market investment. Our AI-powered platform is designed to guide you every step
              of the way, providing real-time insights, personalized strategies, and 24/7 market monitoring. With intuitive
              tools and data-driven analysis at your fingertips, you'll have everything you need to make smart, confident decisions.
            </p>

            <h2 className="features-heading"><span className="ready-highlight">|</span> EXPLORE OUR FEATURES</h2>

            <div className="feature-icons">
              <div className="feature-icon">
                <img src={aiDriven} alt="AI-Driven" />
                <p>AI-Driven Insights</p>
              </div>
              <div className="feature-icon">
                <img src={realTime} alt="Real-Time Data" />
                <p>Real-Time Data</p>
              </div>
              <div className="feature-icon">
                <img src={customized} alt="Customized Portfolio" />
                <p>Customized Portfolio</p>
              </div>
              <div className="feature-icon">
                <img src={expert} alt="Expert Support" />
                <p>Expert Support</p>
              </div>
            </div>
          </section>

          <section className="payments-section" data-aos="fade-up">
            <h3>MAKE DEPOSITS AND WITHDRAW CONVENIENTLY</h3>
            <div className="payments-logos">
              <img src={visa} alt="Visa" />
              <img src={maestro} alt="Maestro" />
              <img src={union} alt="UnionPay" />
              <img src={klarna} alt="Klarna" />
              <img src={apple} alt="Apple Pay" />
              <img src={amazon} alt="Amazon Pay" />
              <img src={paypal} alt="PayPal" />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer data-aos="fade-up">
        <p>&copy; 2025 Egyptian Stock Predictor. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
