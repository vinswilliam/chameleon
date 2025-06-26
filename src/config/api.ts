// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions/api' 
  : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  SUBMISSIONS: `${API_BASE_URL}/submissions`,
  HEALTH: `${API_BASE_URL}/health`,
  VERIFY_OTP: (id: string) => `${API_BASE_URL}/submissions/${id}/verify-otp`,
  SUBMIT_ANSWERS: (id: string) => `${API_BASE_URL}/submissions/${id}/answers`,
  LUCKY_DRAW: (id: string) => `${API_BASE_URL}/submissions/${id}/lucky-draw`,
};

export { API_BASE_URL };
