import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';
import './QuestionPage.css';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'How did you hear about our product?',
    type: 'multiple-choice',
    options: ['Social Media', 'Friends/Family', 'Advertisement', 'Website', 'Other'],
    required: true
  },
  {
    id: 'q2',
    question: 'Rate your experience with our service (1-5)',
    type: 'rating',
    required: true
  },
  {
    id: 'q3',
    question: 'Any additional feedback?',
    type: 'text',
    required: false
  }
];

const QuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we have a submission ID and if OTP was verified
    const submissionId = localStorage.getItem('submissionId');
    if (!submissionId) {
      navigate('/phone-input');
      return;
    }
  }, [navigate]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];
    
    if (currentQuestion.required && (!currentAnswer || currentAnswer === '')) {
      setError('This question is required');
      return;
    }

    setError('');
    
    if (isLastQuestion) {
      handleSubmitAnswers();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmitAnswers = async () => {
    setLoading(true);
    setError('');

    try {
      const submissionId = localStorage.getItem('submissionId');
      const response = await fetch(API_ENDPOINTS.SUBMIT_ANSWERS(submissionId!), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        navigate('/lucky-draw');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit answers');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionInput = () => {
    const currentAnswer = answers[currentQuestion.id] || '';

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="options-container">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={option}
                className={`option-btn ${currentAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerChange(currentQuestion.id, option)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                className={`rating-btn ${currentAnswer === rating ? 'selected' : ''}`}
                onClick={() => handleAnswerChange(currentQuestion.id, rating)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: rating * 0.1 }}
              >
                {rating}
              </motion.button>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            className="text-input"
            value={currentAnswer as string}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Enter your answer..."
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="question-page"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.div 
          className="question-container"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          <motion.h1
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {currentQuestion.question}
          </motion.h1>

          {currentQuestion.required && (
            <div className="required-indicator">* Required</div>
          )}

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderQuestionInput()}
          </motion.div>

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button 
                className="prev-btn"
                onClick={handlePrevious}
                disabled={loading}
              >
                ← Previous
              </button>
            )}

            <motion.button 
              className="next-btn"
              onClick={handleNext}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? 'Submitting...' : isLastQuestion ? 'Submit' : 'Next →'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuestionPage;
