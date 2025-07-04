import React, { useEffect } from 'react';
import '../styles/AboutUs.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/header';

import rani from '../assets/images/rani.svg';
import nourany from '../assets/images/nourany.svg';
import mazen from '../assets/images/mazen.svg';
import gendy from '../assets/images/gendy.svg';
import nourant from '../assets/images/nourant.svg';
import marwan from '../assets/images/marwan.svg';

const team = [
  { name: "Rani Youssef", role: "Backend Development & AI", img: rani },
  { name: "Nouran Yousry", role: "Backend Development & AI", img: nourany },
  { name: "Mazen Darwish", role: "Data Analyst", img: mazen },
  { name: "Youssef El Gendy", role: "Software Developer", img: gendy },
  { name: "Nouran Tarek", role: "Software Developer", img: nourant },
  { name: "Marwan Tarek", role: "DevOps Engineer", img: marwan },
];

function AboutUs({ darkMode, setDarkMode }) {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className={`about-layout ${darkMode ? 'dark' : ''}`}>
      <div className="app">
        {/* Shared Header */}
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        {/* Page content wrapper */}
        <main className="about-wrapper">
          {/* Mission */}
          <section className="mission-section" data-aos="fade-up">
            <h1 className="mission-title">Our Mission</h1>
            <p className="mission-text">
              We are committed to reshaping how investors interact with the stock market by making powerful,
              AI-driven tools accessible to all. Our vision blends simplicity, intelligence, and strategy to help you
              trade smarter.
            </p>
            <h1 className="mission-title">How does it work?</h1>
            <p className="mission-text">
              Our website uses two machine learning models: a <strong>regressor</strong> and a <strong>classifier</strong>.
              The regressor predicts future stock prices based on historical patterns and news, while the classifier estimates
              the likelihood of the stock moving up or down. Together, they provide users with both precise forecasts
              and movement direction — helping investors make better decisions.
            </p>
          </section>

          {/* Team */}
          <section className="team-section" data-aos="fade-up">
            <h2 className="team-heading">Meet Our Team</h2>
            <div className="team-grid">
              {team.map((member, index) => (
                <div className="team-card" data-aos="zoom-in" key={index}>
                  <div className="img-wrapper">
                    <img src={member.img} alt={member.name} />
                  </div>
                  <div className="info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer data-aos="fade-up">
          <p>&copy; 2025 Egyptian Stock Predictor. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default AboutUs;
