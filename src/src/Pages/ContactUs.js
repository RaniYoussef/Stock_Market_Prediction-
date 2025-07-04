import React, { useState } from 'react';
import '../styles/ContactUs.css';
import Header from '../components/header';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUs = ({ darkMode, setDarkMode }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
  };

  const handleDismiss = () => {
    setSubmitted(false);
  };

  return (
    <div className={`contact-page ${darkMode ? 'dark' : ''}`}>
      <div className="app">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        <div className="contact-container">
          <h1>Contact Us</h1>
          <p>Have questions, suggestions, or need support? Reach out to us!</p>

          <AnimatePresence>
            {submitted && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <span>✅ Thank you! We’ve received your message.</span>
                <button onClick={handleDismiss} className="dismiss-button">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" placeholder="Your full name" required />
            </label>

            <label>
              Email:
              <input type="email" placeholder="your@email.com" required />
            </label>

            <label>
              Message:
              <textarea placeholder="Write your message here..." rows="5" required />
            </label>

            <button type="submit">Send Message</button>
          </form>

          <div className="contact-details">
            <p>Email: support@egyptstockpredictor.com</p>
            <p>Phone: +20 100 123 4567</p>
            <p>Location: Alexandria, Egypt</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
