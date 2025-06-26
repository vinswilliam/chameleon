import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';
import './LuckyDrawPage.css';

interface Prize {
  id: string;
  name: string;
  color: string;
  probability: number; // percentage
}

const prizes: Prize[] = [
  { id: '1', name: 'Grand Prize!', color: '#FF6B6B', probability: 5 },
  { id: '2', name: 'Gift Voucher', color: '#4ECDC4', probability: 15 },
  { id: '3', name: 'Free Coffee', color: '#45B7D1', probability: 25 },
  { id: '4', name: 'Discount 20%', color: '#96CEB4', probability: 30 },
  { id: '5', name: 'Thank You', color: '#FFEAA7', probability: 25 }
];

const LuckyDrawPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    // Check if we have a submission ID
    const submissionId = localStorage.getItem('submissionId');
    if (!submissionId) {
      navigate('/phone-input');
      return;
    }
  }, [navigate]);

  const getRandomPrize = (): Prize => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        return prize;
      }
    }
    
    return prizes[prizes.length - 1]; // fallback
  };

  const handleSpin = async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    
    // Calculate winning prize
    const winningPrize = getRandomPrize();
    const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id);
    
    // Calculate rotation (multiple full rotations + position for winning prize)
    const baseRotation = 360 * 5; // 5 full rotations
    const prizeAngle = (360 / prizes.length) * prizeIndex;
    const finalRotation = baseRotation + (360 - prizeAngle); // Subtract because wheel spins clockwise
    
    setRotation(prev => prev + finalRotation);
    
    // Wait for spin animation to complete
    setTimeout(async () => {
      setIsSpinning(false);
      setResult(winningPrize);
      setHasSpun(true);
      
      // Save result to backend
      try {
        const submissionId = localStorage.getItem('submissionId');
        await fetch(API_ENDPOINTS.LUCKY_DRAW(submissionId!), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ result: winningPrize.name }),
        });
      } catch (error) {
        console.error('Failed to save lucky draw result:', error);
      }
    }, 3000);
  };

  const handleContinue = () => {
    navigate('/thank-you');
  };

  return (
    <motion.div 
      className="lucky-draw-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.div 
          className="draw-container"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>🎉 Lucky Draw Time! 🎉</h1>
          <p>Spin the wheel to win exciting prizes!</p>

          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <motion.div 
              className="wheel"
              animate={{ rotate: rotation }}
              transition={{ 
                duration: isSpinning ? 3 : 0,
                ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear"
              }}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                return (
                  <div
                    key={prize.id}
                    className="wheel-segment"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      backgroundColor: prize.color,
                    }}
                  >
                    <div 
                      className="prize-text"
                      style={{ transform: `rotate(${360 / prizes.length / 2}deg)` }}
                    >
                      {prize.name}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {!hasSpun ? (
            <motion.button 
              className="spin-btn"
              onClick={handleSpin}
              disabled={isSpinning}
              whileHover={{ scale: isSpinning ? 1 : 1.1 }}
              whileTap={{ scale: isSpinning ? 1 : 0.9 }}
            >
              {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
            </motion.button>
          ) : (
            <motion.div 
              className="result-section"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="result-card" style={{ backgroundColor: result?.color }}>
                <h2>🎊 Congratulations! 🎊</h2>
                <div className="prize-name">{result?.name}</div>
              </div>
              
              <motion.button 
                className="continue-btn"
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LuckyDrawPage;
