import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PhoneInputPage from './components/PhoneInputPage';
import OTPPage from './components/OTPPage';
import QuestionPage from './components/QuestionPage';
import LuckyDrawPage from './components/LuckyDrawPage';
import ThankYouPage from './components/ThankYouPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/phone-input" element={<PhoneInputPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/lucky-draw" element={<LuckyDrawPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
