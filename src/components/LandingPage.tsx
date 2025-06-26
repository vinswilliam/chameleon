import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/phone-input');
  };

  // QR code will link to this same page
  const qrCodeValue = window.location.origin;

  return (
    <motion.div 
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero-section">
        <motion.div 
          className="product-image"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Placeholder for product image */}
          <div className="product-placeholder">
            <h2>🎁 Special Offer</h2>
            <p>Win Amazing Prizes!</p>
          </div>
        </motion.div>

        <motion.div 
          className="content"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1>Welcome to Our Lucky Draw!</h1>
          <p>Scan the QR code or tap the button below to participate and win exciting prizes!</p>
          
          <div className="qr-section">
            <QRCodeSVG 
              value={qrCodeValue}
              size={200}
              level="H"
              includeMargin={true}
            />
            <p className="qr-text">Scan to participate</p>
          </div>

          <motion.button 
            className="get-started-btn"
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
