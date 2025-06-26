import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface UserSubmission {
  id: string;
  phoneNumber: string;
  outletNumber: string;
  eligibilityAge: number;
  otpVerified: boolean;
  questionAnswers: Record<string, string | number | boolean>;
  luckyDrawResult?: string;
  timestamp: string;
}

// Data file path
const dataFilePath = path.join(__dirname, '../../data/submissions.json');

// Helper function to read submissions
const readSubmissions = (): UserSubmission[] => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
};

// Helper function to write submissions
const writeSubmissions = (submissions: UserSubmission[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2));
  } catch (error) {
    console.error('Error writing submissions:', error);
    throw error;
  }
};

// POST /api/submissions - Create new submission
router.post('/', (req, res) => {
  try {
    const { phoneNumber, outletNumber, eligibilityAge } = req.body;

    // Validation
    if (!phoneNumber || !outletNumber || !eligibilityAge) {
      return res.status(400).json({ 
        error: 'Phone number, outlet number, and eligibility age are required' 
      });
    }

    const submissions = readSubmissions();
    const newSubmission: UserSubmission = {
      id: Date.now().toString(),
      phoneNumber,
      outletNumber,
      eligibilityAge: parseInt(eligibilityAge),
      otpVerified: false,
      questionAnswers: {},
      timestamp: new Date().toISOString()
    };

    submissions.push(newSubmission);
    writeSubmissions(submissions);

    res.status(201).json({ 
      message: 'Submission created successfully',
      submissionId: newSubmission.id 
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// PUT /api/submissions/:id/verify-otp - Verify OTP
router.put('/:id/verify-otp', (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    // Simple OTP verification (in real app, use proper OTP service)
    if (otp !== '1234') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const submissions = readSubmissions();
    const submissionIndex = submissions.findIndex(sub => sub.id === id);

    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submissions[submissionIndex].otpVerified = true;
    writeSubmissions(submissions);

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// PUT /api/submissions/:id/answers - Submit question answers
router.put('/:id/answers', (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const submissions = readSubmissions();
    const submissionIndex = submissions.findIndex(sub => sub.id === id);

    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (!submissions[submissionIndex].otpVerified) {
      return res.status(400).json({ error: 'OTP not verified' });
    }

    submissions[submissionIndex].questionAnswers = answers;
    writeSubmissions(submissions);

    res.json({ message: 'Answers submitted successfully' });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ error: 'Failed to submit answers' });
  }
});

// PUT /api/submissions/:id/lucky-draw - Submit lucky draw result
router.put('/:id/lucky-draw', (req, res) => {
  try {
    const { id } = req.params;
    const { result } = req.body;

    const submissions = readSubmissions();
    const submissionIndex = submissions.findIndex(sub => sub.id === id);

    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submissions[submissionIndex].luckyDrawResult = result;
    writeSubmissions(submissions);

    res.json({ message: 'Lucky draw result saved successfully' });
  } catch (error) {
    console.error('Error saving lucky draw result:', error);
    res.status(500).json({ error: 'Failed to save lucky draw result' });
  }
});

// GET /api/submissions - Get all submissions (for admin)
router.get('/', (req, res) => {
  try {
    const submissions = readSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/submissions/:id - Get specific submission
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const submissions = readSubmissions();
    const submission = submissions.find(sub => sub.id === id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

export default router;
