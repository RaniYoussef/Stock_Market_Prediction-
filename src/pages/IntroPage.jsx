import React from 'react';
import '../styles/IntroPage.css';


// 📦 Import assets here (replace with actual file paths as needed)
import logo from '../assets/logo.jpeg';
import aiIcon from '../assets/images/image-9-54.png';
import domainIcon from '../assets/images/image-7-60.png';
import brokerIcon from '../assets/images/image-6-57.png';
import chipImage from '../assets/images/rectangle-3-3.png';
import feature1 from '../assets/images/image-15-70.png';
import feature2 from '../assets/images/image-15-75.png';
import feature3 from '../assets/images/image-15-79.png';
import feature4 from '../assets/images/image-15-83.png';
import visa from '../assets/images/rectangle-21-85.png';
import maestro from '../assets/images/rectangle-22-86.png';
import unionpay from '../assets/images/rectangle-23-87.png';
import klarna from '../assets/images/rectangle-24-88.png';
import applepay from '../assets/images/rectangle-25-89.png';
import amazonpay from '../assets/images/rectangle-26-90.png';
import paypal from '../assets/images/rectangle-27-91.png';
import team1 from '../assets/images/ellipse-2-37.svg';
import team2 from '../assets/images/ellipse-4-39.svg';
import team3 from '../assets/images/ellipse-5-38.svg';
import team4 from '../assets/images/ellipse-6-40.svg';
import team5 from '../assets/images/ellipse-7-42.svg';
import team6 from '../assets/images/ellipse-8-41.svg';

const IntroPage = () => {
  return (
    <div className="homepage-wrapper">
      {/* Header */}
      <header className="top-bar">
        <div className="logo">
          <img src={logo} alt="Easy Money Logo" width="60" height="60" />
          <h1>EASY MONEY</h1>
        </div>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="#">ABOUT US</a></li>
            <li><a href="ContactUs">CONTACT US</a></li>
            <li><a href="/signup">SIGN UP</a></li>
            <li><a href="/SignIn">SIGN IN</a></li>
          </ul>
        </nav>
        <div className="cta-button">
          <a href="#" aria-label="Deposit now">DEPOSIT NOW!</a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text">
            <h2>TRADE LIKE</h2>
            <h2>A MASTER</h2>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <div className="feature-item">
              <img src={aiIcon} alt="AI Icon" />
              <h3>ARTIFICIAL INTELLIGENCE</h3>
            </div>
            <div className="feature-item">
              <img src={domainIcon} alt="Domain Experts Icon" />
              <h3>DOMAIN EXPERTS</h3>
            </div>
            <div className="feature-item">
              <img src={brokerIcon} alt="Broker Assistance Icon" />
              <h3>BROKER ASSISTANCE</h3>
            </div>
          </div>
          <p className="tagline">AI-powered stock predictions for better investing</p>
        </section>

        {/* Ready Section */}
        <section className="ready-section">
          <div className="content-container">
            <div className="image-container">
              <img src={chipImage} alt="AI Chip Technology" />
            </div>
            <div className="text-container">
              <h2>ARE YOU READY?</h2>
              <p>
                We provide reliable and expert guidance for all your brokerage needs. Whether you're new to investing
                or an experienced trader, our platform offers tailored solutions to help you navigate the financial
                markets with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="intro-section">
          <div className="intro-content">
            <p>
              Welcome To The Future Of Stock Market Investment. Our AI-Powered Platform Is Designed To Guide You Every
              Step Of The Way, Providing Real-Time Insights, Personalized Strategies, And 24/7 Market Monitoring. With
              Intuitive Tools And Data-Driven Analysis At Your Fingertips, You'll Have Everything You Need To Make
              Smart, Confident Decisions.
            </p>
          </div>
        </section>

        {/* Explore Our Features */}
        <section className="features-section">
          <h2>EXPLORE OUR FEATURES</h2>
          <div className="features-container">
            <div className="feature-item"><img src={feature1} alt="AI-Driven Insights" /><h3>AI-Driven Insights</h3></div>
            <div className="feature-item"><img src={feature2} alt="Real-Time Data" /><h3>Real-Time Data</h3></div>
            <div className="feature-item"><img src={feature3} alt="Customized Portfolio" /><h3>Customized Portfolio</h3></div>
            <div className="feature-item"><img src={feature4} alt="Expert Support" /><h3>Expert Support</h3></div>
          </div>
        </section>

        {/* Payments Section */}
        <section className="payments-section">
          <h3>MAKE DEPOSITS AND WITHDRAW CONVENIENTLY</h3>
          <div className="payments-container">
            <img src={visa} alt="Visa" />
            <img src={maestro} alt="Maestro" />
            <img src={unionpay} alt="UnionPay" />
            <img src={klarna} alt="Klarna" />
            <img src={applepay} alt="Apple Pay" />
            <img src={amazonpay} alt="Amazon Pay" />
            <img src={paypal} alt="PayPal" />
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>MEET OUR TEAM !</h2>
          <div className="team-container">
            {[team1, team2, team3, team4, team5, team6].map((member, idx) => (
              <div className="team-member" key={idx}>
                <img src={member} alt={`Team Member ${idx + 1}`} />
                <div className="team-info">
                  <h3>{[
                    "Youssef El Gendy", "Nouran Tarek", "Mazen Darwish",
                    "Marwan Tarek", "Rani Youssef", "Nouran Yousry"
                  ][idx]}</h3>
                  <p>{[
                    "Data Analyst & Software Developer", "Software Developer", "Data Analyst",
                    "Software Developer", "Backend Development & AI", "Backend Development & AI"
                  ][idx]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Easy Money. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default IntroPage;
