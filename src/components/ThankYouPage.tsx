import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ThankYouPage.css';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a submission ID
    const submissionId = localStorage.getItem('submissionId');
    if (!submissionId) {
      navigate('/phone-input');
      return;
    }
  }, [navigate]);

  const handleStartOver = () => {
    // Clear stored data
    localStorage.removeItem('submissionId');
    navigate('/');
  };

  return (
    <motion.div 
      className="thank-you-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.div 
          className="thank-you-container"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="confetti-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Animated confetti elements */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                style={{
                  left: `${10 + i * 7}%`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 5],
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>

          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            ✅
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Thank You!
          </motion.h1>

          <motion.p 
            className="main-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            🎉 Congratulations on completing the lucky draw! 🎉
          </motion.p>

          <motion.div 
            className="message-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h3>What's Next?</h3>
            <ul>
              <li>📧 You'll receive an email confirmation shortly</li>
              <li>🎁 Prize redemption details will be sent to you</li>
              <li>📱 Keep an eye on your phone for updates</li>
              <li>💬 Our team may contact you for verification</li>
            </ul>
          </motion.div>

          <motion.div 
            className="additional-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p>
              Thank you for participating in our promotion! 
              We appreciate your time and feedback.
            </p>
          </motion.div>

          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.button 
              className="start-over-btn"
              onClick={handleStartOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Entry
            </motion.button>
          </motion.div>

          <motion.div 
            className="social-share"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <p>Share your experience with friends!</p>
            <div className="share-buttons">
              <div className="share-btn">📱 Share</div>
              <div className="share-btn">💬 Tell Friends</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThankYouPage;
