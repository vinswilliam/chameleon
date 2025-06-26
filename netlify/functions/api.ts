import type { Handler, HandlerEvent } from "@netlify/functions";

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

const submissions: UserSubmission[] = [];

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() })
      };
    }

    // Create submission
    if (path === '/submissions' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { phoneNumber, outletNumber, eligibilityAge } = body;

      if (!phoneNumber || !outletNumber || !eligibilityAge) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Phone number, outlet number, and eligibility age are required' })
        };
      }

      const newSubmission = {
        id: Date.now().toString(),
        phoneNumber,
        outletNumber,
        eligibilityAge: parseInt(eligibilityAge),
        otpVerified: false,
        questionAnswers: {},
        timestamp: new Date().toISOString()
      };

      submissions.push(newSubmission);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          message: 'Submission created successfully',
          submissionId: newSubmission.id 
        })
      };
    }

    // Verify OTP
    if (path.includes('/verify-otp') && method === 'PUT') {
      const id = path.split('/')[2];
      const body = JSON.parse(event.body || '{}');
      const { otp } = body;

      if (otp !== '1234') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid OTP' })
        };
      }

      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Submission not found' })
        };
      }

      submissions[submissionIndex].otpVerified = true;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'OTP verified successfully' })
      };
    }

    // Submit answers
    if (path.includes('/answers') && method === 'PUT') {
      const id = path.split('/')[2];
      const body = JSON.parse(event.body || '{}');
      const { answers } = body;

      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Submission not found' })
        };
      }

      if (!submissions[submissionIndex].otpVerified) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'OTP not verified' })
        };
      }

      submissions[submissionIndex].questionAnswers = answers;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Answers submitted successfully' })
      };
    }

    // Submit lucky draw result
    if (path.includes('/lucky-draw') && method === 'PUT') {
      const id = path.split('/')[2];
      const body = JSON.parse(event.body || '{}');
      const { result } = body;

      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Submission not found' })
        };
      }

      submissions[submissionIndex].luckyDrawResult = result;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Lucky draw result saved successfully' })
      };
    }

    // Get all submissions
    if (path === '/submissions' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(submissions)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
