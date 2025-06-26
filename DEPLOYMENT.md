# Deployment Guide - Netlify

## 🚀 **Deploy to Netlify (Frontend + Serverless Backend)**

### **Step 1: Prepare for Deployment**

1. **Build the project**:
```bash
npm run build
```

2. **Test locally with Netlify CLI (optional)**:
```bash
npm install -g netlify-cli
netlify dev
```

### **Step 2: Deploy to Netlify**

#### **Option A: Git-based Deployment (Recommended)**

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit - Mobile Landing Page with Lucky Draw"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Netlify will auto-detect the build settings from `netlify.toml`

#### **Option B: Manual Deployment**

1. **Build the project**:
```bash
npm run build
```

2. **Deploy via Netlify CLI**:
```bash
netlify deploy --prod --dir=dist
```

### **Step 3: Environment Configuration**

The app automatically detects production environment and uses Netlify Functions.

- **Development**: Uses `http://localhost:3001/api`
- **Production**: Uses `/.netlify/functions/api`

### **Step 4: Test Your Deployment**

1. Your app will be available at: `https://your-app-name.netlify.app`
2. Test all features:
   - Landing page loads
   - Form submission works
   - OTP verification (use: 1234)
   - Survey questions
   - Lucky draw wheel
   - Thank you page

## 🔧 **Alternative: Separate Frontend/Backend Deployment**

If you prefer to keep them separate:

### **Frontend to Netlify**
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### **Backend to Railway/Render/Vercel**
```bash
cd backend
npm run build
# Deploy to your preferred backend hosting service
```

Then update `src/config/api.ts` with your backend URL:
```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 📱 **Features Available in Production**

✅ **Mobile-optimized responsive design**
✅ **QR code generation**
✅ **Form validation and submission**
✅ **OTP verification system**
✅ **Interactive survey**
✅ **Animated lucky draw wheel**
✅ **Data persistence (in-memory for demo)**
✅ **CORS-enabled API**
✅ **Serverless backend functions**

## 🛠 **Production Considerations**

For production use, consider:

1. **Database**: Replace in-memory storage with a database (MongoDB, PostgreSQL)
2. **OTP Service**: Integrate with SMS providers (Twilio, AWS SNS)
3. **Authentication**: Add proper user authentication
4. **Analytics**: Add tracking for user interactions
5. **Error Monitoring**: Add error reporting (Sentry)
6. **CDN**: Use CDN for static assets
7. **Email**: Add email notifications for winners

## 🔗 **Useful Links**

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Deployment Guide](https://docs.netlify.com/site-deploys/overview/)
- [React Production Build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)
