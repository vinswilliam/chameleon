# Mobile Landing Page with Lucky Draw

A responsive mobile web application built with React (Vite + TypeScript) frontend and Node.js Express backend for conducting lucky draw campaigns.

## Features

### Frontend (Mobile Web App)
- **Landing Page**: Welcome screen with QR code and product showcase
- **Phone Input**: Form to collect user details (phone, outlet number, age)
- **OTP Verification**: 4-digit OTP verification system
- **Questions**: Interactive survey with multiple question types
- **Lucky Draw**: Animated spinning wheel with prizes
- **Thank You**: Completion page with next steps

### Backend (Node.js API)
- RESTful API endpoints for data submission
- File-based JSON storage system
- CORS enabled for frontend communication
- Form validation and error handling
- OTP verification system

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Framer Motion** for animations
- **QRCode.react** for QR code generation
- **Styled Components** for styling

### Backend
- **Node.js** with Express framework
- **TypeScript** for type safety
- **File-based storage** (JSON files)
- **CORS, Helmet, Morgan** middleware
- **Environment variables** support

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and setup the project**
```bash
cd "Landing Page"
npm install
```

2. **Setup backend dependencies**
```bash
cd backend
npm install
```

### Development

1. **Start the backend server**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

### Building for Production

1. **Build the backend**
```bash
cd backend
npm run build
npm start
```

2. **Build the frontend**
```bash
npm run build
```

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── LandingPage.*   # Landing page with QR code
│   │   ├── PhoneInputPage.* # Phone and details input
│   │   ├── OTPPage.*       # OTP verification
│   │   ├── QuestionPage.*  # Survey questions
│   │   ├── LuckyDrawPage.* # Spinning wheel
│   │   └── ThankYouPage.*  # Completion page
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── backend/                # Node.js Express server
│   ├── src/
│   │   ├── server.ts       # Main server file
│   │   └── routes/
│   │       └── submissions.ts # API routes
│   └── data/               # JSON data storage
└── .github/
    └── copilot-instructions.md # AI assistant guidelines
```

## API Endpoints

### Submissions
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/:id/verify-otp` - Verify OTP
- `PUT /api/submissions/:id/answers` - Submit survey answers
- `PUT /api/submissions/:id/lucky-draw` - Save lucky draw result
- `GET /api/submissions` - Get all submissions (admin)
- `GET /api/submissions/:id` - Get specific submission

### Health Check
- `GET /api/health` - Server health status

## Mobile Optimization

This application is specifically designed for mobile devices with:
- Responsive design (mobile-first)
- Touch-friendly interfaces
- Optimized input fields
- Smooth animations and transitions
- iOS and Android compatible
- PWA-ready architecture

## Demo Data

For testing purposes:
- **OTP**: Use `1234` for verification
- **Lucky Draw**: Random prizes with weighted probabilities

## Environment Variables

Backend `.env` configuration:
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Deployment to Netlify

This application is ready for deployment to Netlify with both frontend and backend (using Netlify Functions).

### Quick Deploy

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
   - Push to GitHub
   - Connect GitHub repo to Netlify
   - Netlify will auto-deploy using `netlify.toml` configuration

### Local Testing with Netlify
```bash
npx netlify dev
```

### Manual Deploy
```bash
./deploy.sh
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### API Configuration

The app automatically switches between:
- **Development**: `http://localhost:3001/api`
- **Production**: `/.netlify/functions/api` (Netlify Functions)

## ✅ **Ready for Production**

✅ Netlify Functions for serverless backend
✅ Automatic API endpoint switching
✅ Production build optimization
✅ Mobile-responsive design
✅ CORS configuration
✅ Environment detection
