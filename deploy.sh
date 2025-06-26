#!/bin/bash

echo "🚀 Preparing for Netlify deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Build complete! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push this code to GitHub"
echo "2. Connect your GitHub repo to Netlify"
echo "3. Netlify will automatically deploy using the netlify.toml configuration"
echo ""
echo "🌐 Your app will be available at: https://your-app-name.netlify.app"
echo ""
echo "📱 Test the app with demo OTP: 1234"
