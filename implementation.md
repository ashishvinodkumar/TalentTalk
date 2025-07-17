TalentTalk: Where talent speaks for itself
Overview

This plan provides step-by-step Cursor prompts to build a complete AI-powered talent matching platform without writing code manually. Each step includes exact prompts to use with Cursor's AI assistant.
Project Setup (5 minutes)
Step 1: Initialize Project Structure

Cursor Prompt:
Create a new project structure for a talent matching platform with the following structure:
- talent-match-hackathon/ (root folder)
  - backend/ (Python FastAPI)
  - frontend/ (React app)
  - uploads/ (for resume files)
  - README.md

Create the folder structure and initialize both backend and frontend projects. For backend, create a requirements.txt with FastAPI, uvicorn, scrapy, openai, pandas, python-multipart, python-dotenv. For frontend, create a React app with axios and tailwindcss dependencies.
Step 2: Environment Setup
Cursor Prompt:
Create a .env file in the root directory with OPENAI_API_KEY placeholder. Also create a .gitignore file that ignores .env, __pycache__, node_modules, uploads/, and talent_match.db files.
Backend Development (Hour 1)
Step 3: Database Setup
uv
Cursor Prompt:
Create a SQLite database setup file called backend/database.py that:
1. Creates a candidates table with: id, name, email, skills, experience, resume_path, linkedin_url, created_at
2. Creates a jobs table with: id, title, requirements, company, created_at  
3. Creates a matches table with: id, candidate_id, job_id, score, created_at
4. Creates an interests table with: id, candidate_id, job_id, created_at
5. Includes proper foreign key relationships
6. Has an init_database() function that creates all tables
7. Can be run standalone to initialize the database

Use SQLite3 and include proper error handling. Make it production-ready with proper SQL schema.
Step 4: Resume Parser with OpenAI
Cursor Prompt:
Create backend/resume_parser.py that:
1. Uses OpenAI API to parse resume text and extract: name, email, skills, experience, job_titles
2. Has a ResumeParser class with parse_resume(resume_text) method
3. Returns structured JSON data from the resume
4. Includes error handling for API failures
5. Has a method to extract skills from any text input
6. Uses environment variables for API key
7. Includes proper prompt engineering for accurate extraction

Make it robust and handle different resume formats. Include docstrings and type hints.
Step 5: LinkedIn Scraper
Cursor Prompt:
Create backend/linkedin_spider.py using Scrapy that:
1. Creates a LinkedInSpider class that can scrape profile information
2. Extracts: name, title, location, experience, skills, education, summary
3. Handles different LinkedIn profile layouts
4. Includes anti-detection measures (user agents, delays)
5. Returns structured data as JSON
6. Has a helper function scrape_linkedin_profile(url) that returns demo data for hackathon
7. Includes proper error handling and logging

For the hackathon, make it return realistic mock data instead of actual scraping to avoid rate limits.
Step 6: AI Matching Engine
Cursor Prompt:
Create backend/matcher.py that:
1. Uses OpenAI to match candidates with job requirements
2. Has a TalentMatcher class with match_candidates(job_requirements, candidates) method
3. Returns top 3 matches with scores and explanations
4. Includes calculate_match_score() method that returns 0-100 score
5. Has generate_job_requirements() method for conversation-based job creation
6. Uses proper prompt engineering for accurate matching
7. Includes error handling and fallback mechanisms

Make the matching algorithm sophisticated and explainable. Include confidence scores and reasoning.
Step 7: FastAPI Backend
Cursor Prompt:
Create backend/main.py with FastAPI that includes:
1. CORS middleware for React frontend
2. POST /upload-resume/ endpoint for file upload and parsing
3. POST /import-linkedin/ endpoint for LinkedIn profile import
4. POST /create-job/ endpoint for job creation
5. GET /jobs/ endpoint to list all jobs
6. GET /candidates/ endpoint to list all candidates
7. GET /match-candidates/{job_id} endpoint for AI matching
8. POST /express-interest/ endpoint for candidate interest tracking
9. Proper error handling and status codes
10. Pydantic models for request/response validation
11. Database integration with all CRUD operations

Make it production-ready with proper error handling, validation, and documentation.
Frontend Development (Hour 2)
Step 8: React App Structure
Cursor Prompt:
Create the main React app structure in frontend/src/:
1. App.js with navigation between Candidate and Hiring Manager portals
2. Components folder with reusable UI components
3. Pages folder with CandidatePortal.js and HiringManagerPortal.js
4. Proper routing and state management
5. Tailwind CSS styling with modern, professional design
6. Responsive layout that works on desktop and mobile

Include a navigation bar with toggle between user types and modern UI components.
Step 9: Candidate Portal
Cursor Prompt:
Create frontend/src/pages/CandidatePortal.js that:
1. Has a resume upload section with file input and upload button
2. LinkedIn profile import section with URL input
3. Displays parsed candidate data after upload
4. Shows available jobs in a card layout
5. Includes "❤️ Interested" buttons for each job
6. Has proper loading states and error handling
7. Uses modern React hooks (useState, useEffect)
8. Integrates with backend API using axios
9. Has responsive design with Tailwind CSS
10. Shows upload status and success/error messages

Make it user-friendly with clear instructions and visual feedback.
Step 10: Hiring Manager Portal
Cursor Prompt:
Create frontend/src/pages/HiringManagerPortal.js that:
1. Has job creation form with title, company, requirements fields
2. Job selection dropdown for finding matches
3. "Find Top 3 Matches" button that calls AI matching
4. Displays matched candidates with scores and explanations
5. "Contact Candidate" buttons that reveal contact information
6. Shows match reasoning and candidate details
7. Has proper form validation and error handling
8. Uses modern React patterns and hooks
9. Responsive design with professional styling
10. Real-time updates when jobs are created

Make it intuitive for hiring managers with clear candidate information display.
Step 11: UI Components and Styling
Cursor Prompt:
Create reusable UI components in frontend/src/components/:
1. JobCard.js for displaying job postings
2. CandidateCard.js for showing candidate matches
3. UploadButton.js for file upload functionality
4. LoadingSpinner.js for loading states
5. ErrorMessage.js for error display
6. SuccessMessage.js for success feedback

Configure Tailwind CSS for modern styling with:
- Professional color scheme (blues, grays, whites)
- Hover effects and transitions
- Responsive breakpoints
- Form styling with proper spacing
- Button variants (primary, secondary, danger)
- Card layouts with shadows and borders

Make all components accessible and mobile-friendly.
Step 12: API Integration
Cursor Prompt:
Create frontend/src/services/api.js that:
1. Configures axios with base URL for backend
2. Has functions for all API endpoints:
   - uploadResume(file)
   - importLinkedIn(url)
   - createJob(jobData)
   - getJobs()
   - getCandidates()
   - matchCandidates(jobId)
   - expressInterest(candidateId, jobId)
3. Includes proper error handling and response formatting
4. Has request/response interceptors for logging
5. Handles file uploads with proper headers
6. Includes retry logic for failed requests

Make it robust with proper error messages and loading states.
Testing and Demo Setup (15 minutes)
Step 13: Sample Data and Testing
Cursor Prompt:
Create backend/sample_data.py that:
1. Generates realistic sample candidates and jobs for demo
2. Has functions to populate database with test data
3. Includes sample resumes with different formats
4. Creates diverse job postings across industries
5. Includes realistic skills and experience levels
6. Can be run to reset database with fresh demo data

Also create a simple test script that verifies all API endpoints work correctly.
Step 14: Demo Script and Documentation
Cursor Prompt:
Create a comprehensive demo script and documentation:
1. README.md with setup instructions
2. Demo flow document with step-by-step presentation guide
3. API documentation with all endpoints
4. Troubleshooting guide for common issues
5. Sample data explanation
6. Performance optimization tips

Include screenshots placeholders and presentation talking points for hackathon judges.
Step 15: Production Optimization
Cursor Prompt:
Optimize the application for demo presentation:
1. Add loading spinners and smooth transitions
2. Implement proper error boundaries in React
3. Add form validation and user feedback
4. Optimize API response times
5. Add caching for frequently accessed data
6. Include proper logging for debugging
7. Add environment-specific configurations
8. Optimize database queries for performance

Make it production-ready with proper error handling and user experience.
Deployment and Final Setup (10 minutes)
Step 16: Local Development Setup
Cursor Prompt:
Create development setup scripts:
1. backend/start_backend.sh to initialize database and start FastAPI
2. frontend/start_frontend.sh to install dependencies and start React
3. setup.sh to set up entire project from scratch
4. demo_reset.sh to reset database with fresh sample data
5. health_check.py to verify all services are running

Make all scripts executable and include proper error handling.
Step 17: Final Integration and Testing
Cursor Prompt:
Create a final integration test that:
1. Tests the complete user flow from both portals
2. Verifies API endpoints work correctly
3. Tests file upload and parsing
4. Validates AI matching functionality
5. Checks error handling and edge cases
6. Includes performance benchmarks
7. Generates a test report

Also create a presentation checklist for the hackathon demo.
Cursor Usage Tips
For Each Step:
Copy the exact prompt into Cursor's chat
Review generated code before accepting
Ask for modifications if needed: "Can you add error handling to this function?"
Test each component before moving to next step
Save frequently and commit to git
Common Follow-up Prompts:
"Add better error handling to this code"
"Make this more user-friendly with better UI"
"Optimize this for better performance"
"Add comments and documentation"
"Fix any bugs in this implementation"
Debugging Prompts:
"This code has an error: [paste error]. Fix it."
"Improve the user experience of this component"
"Make this API endpoint more robust"
"Add proper validation to this form"
Quick Start Commands
Initial Setup:
# Terminal 1: Backend
cd backend
python database.py
python sample_data.py
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend  
cd frontend
npm install
npm start

# Terminal 3: Environment
export OPENAI_API_KEY="your-key-here"
