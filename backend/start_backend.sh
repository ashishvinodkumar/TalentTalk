#!/bin/bash

# TalentTalk Backend Startup Script
# Initializes database and starts FastAPI server

echo "🚀 Starting TalentTalk Backend..."
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "../.venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv ../.venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ../.venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f "../.env.example" ]; then
        cp ../.env.example ../.env
        echo "📝 Please edit .env file with your OpenAI API key"
    else
        echo "Creating basic .env file..."
        cat > ../.env << EOL
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:///talent_match.db

# Application Configuration
DEBUG=True
HOST=localhost
PORT=8000
EOL
        echo "📝 Please edit .env file with your OpenAI API key"
    fi
fi

# Initialize database
echo "🗄️  Initializing database..."
python database.py

# Populate with sample data
echo "📊 Populating with sample data..."
python sample_data.py

# Start FastAPI server
echo "🌐 Starting FastAPI server..."
echo "   - API Documentation: http://localhost:8000/docs"
echo "   - Health Check: http://localhost:8000/health"
echo "   - Backend running on: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload 