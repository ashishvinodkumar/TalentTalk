# TalentTalk Backend

AI-powered talent matching platform backend built with FastAPI, OpenAI, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- OpenAI API key
- Git

### Setup and Run

1. **Clone and navigate to backend directory:**
```bash
cd backend
```

2. **Run the startup script (Recommended):**
```bash
./start_backend.sh
```

This script will:
- Create virtual environment
- Install dependencies
- Initialize database
- Populate with sample data
- Start the FastAPI server

3. **Manual setup (Alternative):**
```bash
# Create virtual environment
python3 -m venv ../.venv
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export OPENAI_API_KEY="your-api-key-here"

# Initialize database and add sample data
python database.py
python sample_data.py

# Start server
uvicorn main:app --reload --port 8000
```

### 🔑 Environment Configuration

Create a `.env` file in the project root with:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///talent_match.db
DEBUG=True
HOST=localhost
PORT=8000
```

## 📋 API Documentation

Once running, access the interactive API documentation at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Main Endpoints

#### Health & Status
- `GET /` - Basic health check
- `GET /health` - Detailed health status

#### Candidates
- `POST /upload-resume/` - Upload and parse resume file
- `POST /import-linkedin/` - Import LinkedIn profile (demo data)
- `GET /candidates/` - Get all candidates
- `GET /candidates/{id}` - Get specific candidate

#### Jobs
- `POST /create-job/` - Create new job posting
- `GET /jobs/` - Get all jobs
- `GET /jobs/{id}` - Get specific job

#### AI Matching
- `GET /match-candidates/{job_id}` - AI-powered candidate matching
- `GET /matches/{job_id}` - Get stored matches for job

#### Interest Tracking
- `POST /express-interest/` - Record candidate interest
- `GET /candidate-interests/{candidate_id}` - Get candidate interests

#### Utilities
- `POST /generate-job-requirements/` - Convert description to structured requirements
- `DELETE /reset-database/` - Reset database (demo only)

## 🏗️ Architecture

### Core Components

1. **Database Layer** (`database.py`)
   - SQLite database with proper relationships
   - Tables: candidates, jobs, matches, interests
   - CRUD operations and data validation

2. **Resume Parser** (`resume_parser.py`)
   - OpenAI-powered resume analysis
   - Extracts structured data from resume text
   - Skills extraction and candidate summarization

3. **LinkedIn Scraper** (`linkedin_spider.py`)
   - Scrapy-based profile scraping (demo mode)
   - Returns realistic mock data for hackathon
   - Avoids rate limits and compliance issues

4. **AI Matcher** (`matcher.py`)
   - OpenAI-powered candidate-job matching
   - Generates match scores and explanations
   - Conversation-based job requirement generation

5. **FastAPI Backend** (`main.py`)
   - RESTful API with CORS support
   - Request/response validation with Pydantic
   - Error handling and logging

### Data Models

#### Candidate
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "skills": "[\"Python\", \"React\", \"AWS\"]",
  "experience": "5 years of software development",
  "resume_path": "/uploads/resume.pdf",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "created_at": "2023-11-20T10:00:00"
}
```

#### Job
```json
{
  "id": 1,
  "title": "Senior Python Developer",
  "company": "TechCorp",
  "requirements": "5+ years Python, Django, AWS",
  "location": "San Francisco, CA",
  "salary_range": "$120,000 - $160,000",
  "job_type": "Full-time",
  "created_at": "2023-11-20T10:00:00"
}
```

#### Match
```json
{
  "candidate_id": 1,
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "score": 85.5,
  "explanation": "Strong technical skills match...",
  "match_category": "Strong Match",
  "confidence": 0.9
}
```

## 🧪 Testing

### Sample Data
The system comes with realistic sample data including:
- 7 diverse candidate profiles
- 7 job postings across different roles
- Sample interests and matches

### Manual Testing
```bash
# Test resume upload
curl -X POST "http://localhost:8000/upload-resume/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_resume.txt" \
  -F "email=test@example.com"

# Test LinkedIn import
curl -X POST "http://localhost:8000/import-linkedin/" \
  -H "Content-Type: application/json" \
  -d '{"profile_url": "https://linkedin.com/in/johndoe"}'

# Test AI matching
curl -X GET "http://localhost:8000/match-candidates/1"
```

### Test Scripts
```bash
# Test individual components
python resume_parser.py
python linkedin_spider.py
python matcher.py
python database.py
```

## 🔧 Development

### Project Structure
```
backend/
├── main.py              # FastAPI application
├── database.py          # Database management
├── resume_parser.py     # AI resume parsing
├── linkedin_spider.py   # LinkedIn scraping (mock)
├── matcher.py           # AI matching engine
├── sample_data.py       # Demo data generator
├── requirements.txt     # Python dependencies
├── start_backend.sh     # Startup script
└── README.md           # This file
```

### Adding New Features

1. **New API Endpoint:**
   - Add route to `main.py`
   - Create Pydantic models for request/response
   - Add proper error handling

2. **Database Changes:**
   - Modify schema in `database.py`
   - Update CRUD operations
   - Consider migration strategy

3. **AI Features:**
   - Extend `resume_parser.py` or `matcher.py`
   - Test with sample data
   - Monitor API usage and costs

### Error Handling
- All endpoints have comprehensive error handling
- Structured error responses with detail messages
- Logging for debugging and monitoring

### Performance Considerations
- Database indexing for common queries
- Lazy loading of AI services
- Efficient JSON serialization
- Connection pooling for production

## 🚀 Deployment

### Local Development
- Use the startup script for quick setup
- FastAPI auto-reload for development
- SQLite for simplicity

### Production Considerations
- Use PostgreSQL instead of SQLite
- Add authentication and authorization
- Implement rate limiting
- Add monitoring and logging
- Use proper secrets management
- Scale with load balancer

### Environment Variables
```env
# Required
OPENAI_API_KEY=sk-...

# Optional
DATABASE_URL=sqlite:///talent_match.db
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

## 🤝 API Usage Examples

### Upload Resume
```python
import requests

files = {'file': open('resume.pdf', 'rb')}
data = {'email': 'candidate@example.com'}
response = requests.post('http://localhost:8000/upload-resume/', 
                        files=files, data=data)
```

### Create Job
```python
job_data = {
    "title": "Senior Developer",
    "company": "Tech Corp",
    "requirements": "5+ years Python experience",
    "location": "Remote",
    "salary_range": "$100k-150k"
}
response = requests.post('http://localhost:8000/create-job/', 
                        json=job_data)
```

### Find Matches
```python
response = requests.get('http://localhost:8000/match-candidates/1')
matches = response.json()
```

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify OpenAI API key is valid
3. Ensure all dependencies are installed
4. Review the interactive API docs at `/docs`

## 🎯 Demo Features

This backend is specifically designed for hackathon demos with:
- Realistic mock data for LinkedIn scraping
- Fast setup with sample data
- Interactive API documentation
- Comprehensive error handling
- Easy reset functionality for demos 