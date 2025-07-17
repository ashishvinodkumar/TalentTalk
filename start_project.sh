#!/bin/bash

# TalentTalk Project Startup Script
# Starts both backend and frontend servers

echo "🚀 Starting TalentTalk Project..."
echo "=================================="

# Check if we're in the project root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the TalentTalk project root directory"
    exit 1
fi

# Function to kill background processes on script exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📋 Starting backend server..."
cd backend && ./start_backend.sh &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

echo "📋 Starting frontend server..."
cd frontend && ./start_frontend.sh &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ TalentTalk is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID 