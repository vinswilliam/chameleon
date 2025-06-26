import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';
import './OTPPage.css';

const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    // Check if we have a submission ID
    const submissionId = localStorage.getItem('submissionId');
    if (!submissionId) {
      navigate('/phone-input');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submissionId = localStorage.getItem('submissionId');
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP(submissionId!), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpString }),
      });

      if (response.ok) {
        navigate('/questions');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setError('');
    // In a real app, you would call the API to resend OTP
    alert('OTP resent! (For demo, use 1234)');
  };

  return (
    <motion.div 
      className="otp-page"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.div 
          className="otp-container"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>Enter OTP</h1>
          <p>We've sent a 4-digit code to your phone number</p>
          <div className="demo-note">
            <small>Demo: Use 1234 as OTP</small>
          </div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            ))}
          </div>

          <motion.button 
            onClick={handleVerifyOtp}
            className="verify-btn"
            disabled={loading || otp.some(digit => !digit)}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </motion.button>

          <div className="resend-section">
            {resendTimer > 0 ? (
              <p>Resend OTP in {resendTimer}s</p>
            ) : (
              <button 
                onClick={handleResendOtp}
                className="resend-btn"
                disabled={loading}
              >
                Resend OTP
              </button>
            )}
          </div>

          <button 
            className="back-btn"
            onClick={() => navigate('/phone-input')}
            disabled={loading}
          >
            ← Back
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OTPPage;
