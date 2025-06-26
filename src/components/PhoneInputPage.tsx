import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';
import './PhoneInputPage.css';

const PhoneInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    outletNumber: '',
    eligibilityAge: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.outletNumber.trim()) {
      setError('Outlet number is required');
      return false;
    }
    if (!formData.eligibilityAge.trim()) {
      setError('Age is required');
      return false;
    }
    if (parseInt(formData.eligibilityAge) < 18) {
      setError('You must be at least 18 years old to participate');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        // Store submission ID for later use
        localStorage.setItem('submissionId', result.submissionId);
        navigate('/otp');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="phone-input-page"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.div 
          className="form-container"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>Enter Your Details</h1>
          <p>Please provide your information to continue</p>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="outletNumber">Outlet Number</label>
              <input
                type="text"
                id="outletNumber"
                name="outletNumber"
                value={formData.outletNumber}
                onChange={handleInputChange}
                placeholder="Enter outlet number"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="eligibilityAge">Age</label>
              <input
                type="number"
                id="eligibilityAge"
                name="eligibilityAge"
                value={formData.eligibilityAge}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="18"
                disabled={loading}
              />
            </div>

            <motion.button 
              type="submit" 
              className="continue-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? 'Processing...' : 'Continue'}
            </motion.button>
          </form>

          <button 
            className="back-btn"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PhoneInputPage;
