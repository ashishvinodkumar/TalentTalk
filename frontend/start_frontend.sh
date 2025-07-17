#!/bin/bash

# TalentTalk Frontend Startup Script
# Installs dependencies and starts React development server

echo "🚀 Starting TalentTalk Frontend..."
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Install dependencies
echo "📚 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start the development server
echo "🌐 Starting React development server..."
echo "   - Frontend running on: http://localhost:3000"
echo "   - Make sure backend is running on: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start 