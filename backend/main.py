"""
FastAPI backend for TalentTalk - AI-powered talent matching platform.
Provides REST API endpoints for candidate and hiring manager portals.
"""

import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, ValidationError
import uvicorn
from dotenv import load_dotenv

# Import our custom modules
from database import DatabaseManager
from resume_parser import ResumeParser, parse_resume_file
from linkedin_spider import scrape_linkedin_profile
from matcher import TalentMatcher

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="TalentTalk API",
    description="AI-powered talent matching platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize services
db_manager = DatabaseManager()
resume_parser = None
talent_matcher = None

def get_resume_parser():
    """Get resume parser instance with lazy loading."""
    global resume_parser
    if resume_parser is None:
        try:
            resume_parser = ResumeParser()
        except Exception as e:
            logger.error(f"Failed to initialize resume parser: {e}")
            raise HTTPException(status_code=500, detail="Resume parsing service unavailable")
    return resume_parser

def get_talent_matcher():
    """Get talent matcher instance with lazy loading."""
    global talent_matcher
    if talent_matcher is None:
        try:
            talent_matcher = TalentMatcher()
        except Exception as e:
            logger.error(f"Failed to initialize talent matcher: {e}")
            raise HTTPException(status_code=500, detail="AI matching service unavailable")
    return talent_matcher

# Pydantic models for request/response validation
class CandidateResponse(BaseModel):
    id: int
    name: str
    email: str
    skills: str
    experience: Optional[str] = None
    resume_path: Optional[str] = None
    linkedin_url: Optional[str] = None
    created_at: str

class JobRequest(BaseModel):
    title: str
    requirements: str
    company: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = "Full-time"

class JobResponse(BaseModel):
    id: int
    title: str
    requirements: str
    company: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: str
    created_at: str

class LinkedInImportRequest(BaseModel):
    profile_url: str

class InterestRequest(BaseModel):
    candidate_id: int
    job_id: int

class MatchResponse(BaseModel):
    candidate_id: int
    candidate_name: str
    candidate_email: str
    score: float
    explanation: str
    match_category: str

# Startup event to initialize database
@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup."""
    try:
        db_manager.create_tables()
        logger.info("Database initialized successfully")
        
        # Create uploads directory if it doesn't exist
        uploads_dir = Path("../uploads")
        uploads_dir.mkdir(exist_ok=True)
        logger.info("Uploads directory ready")
        
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "message": "TalentTalk API is running",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }



@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check with service status."""
    try:
        # Check database connection
        candidates = db_manager.get_all_candidates()
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Check OpenAI API key
    openai_status = "configured" if os.getenv("OPENAI_API_KEY") else "missing_api_key"
    
    return {
        "status": "healthy",
        "database": db_status,
        "openai": openai_status,
        "timestamp": datetime.now().isoformat()
    }

# Candidate management endpoints
@app.post("/upload-resume/", response_model=Dict[str, Any], tags=["Candidates"])
async def upload_resume(
    file: UploadFile = File(...),
    email: str = Form(...)
):
    """
    Upload and parse a resume file.
    Extracts candidate information and stores in database.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.txt', '.doc', '.docx')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload PDF, TXT, DOC, or DOCX files."
            )
        
        # Read file content
        content = await file.read()
        
        # For demo purposes, convert to text (in production, use proper PDF/DOC parsing)
        if file.filename.lower().endswith('.txt'):
            text_content = content.decode('utf-8')
        else:
            # For non-text files, use a placeholder for demo
            text_content = f"""
            Resume for {email}
            
            PROFESSIONAL SUMMARY
            Experienced professional with diverse skills and background.
            
            SKILLS
            Python, JavaScript, SQL, Project Management, Communication
            
            EXPERIENCE
            Software Developer - TechCorp (2020-2023)
            - Developed web applications
            - Collaborated with cross-functional teams
            - Implemented new features and bug fixes
            
            EDUCATION
            Bachelor's Degree in Computer Science
            University (2020)
            """
        
        # Parse resume using AI
        parser = get_resume_parser()
        parsed_data = parser.parse_resume(text_content)
        
        # Ensure email is set
        if not parsed_data.get('email'):
            parsed_data['email'] = email
        
        # Save file
        file_path = f"../uploads/{uuid.uuid4()}_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Prepare candidate data for database
        candidate_data = {
            'name': parsed_data.get('name', 'Unknown'),
            'email': parsed_data.get('email', email),
            'skills': json.dumps(parsed_data.get('skills', [])),
            'experience': parsed_data.get('summary', ''),
            'resume_path': file_path,
            'raw_data': json.dumps(parsed_data)
        }
        
        # Insert or update candidate in database
        candidate_id, is_update = db_manager.upsert_candidate(candidate_data)
        
        logger.info(f"Resume {'updated' if is_update else 'uploaded and parsed'} for candidate ID: {candidate_id}")
        
        return {
            "success": True,
            "message": f"Resume {'updated' if is_update else 'uploaded and parsed'} successfully",
            "candidate_id": candidate_id,
            "parsed_data": parsed_data,
            "is_update": is_update
        }
        
    except Exception as e:
        logger.error(f"Error uploading resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")

@app.post("/import-linkedin/", response_model=Dict[str, Any], tags=["Candidates"])
async def import_linkedin_profile(request: LinkedInImportRequest):
    """
    Import candidate profile from LinkedIn URL.
    For demo purposes, returns realistic mock data.
    """
    try:
        # Scrape LinkedIn profile (returns mock data for demo)
        profile_data = scrape_linkedin_profile(request.profile_url)
        
        # Prepare candidate data for database
        candidate_data = {
            'name': profile_data.get('name', 'Unknown'),
            'email': profile_data.get('email', ''),  # LinkedIn doesn't provide email
            'skills': json.dumps(profile_data.get('skills', [])),
            'experience': profile_data.get('summary', ''),
            'linkedin_url': request.profile_url,
            'raw_data': json.dumps(profile_data)
        }
        
        # Insert or update candidate in database
        candidate_id, is_update = db_manager.upsert_candidate(candidate_data)
        
        logger.info(f"LinkedIn profile {'updated' if is_update else 'imported'} for candidate ID: {candidate_id}")
        
        return {
            "success": True,
            "message": f"LinkedIn profile {'updated' if is_update else 'imported'} successfully",
            "candidate_id": candidate_id,
            "profile_data": profile_data,
            "is_update": is_update
        }
        
    except Exception as e:
        logger.error(f"Error importing LinkedIn profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to import LinkedIn profile: {str(e)}")

@app.get("/candidates/", response_model=List[CandidateResponse], tags=["Candidates"])
async def get_all_candidates():
    """Get all candidates from the database."""
    try:
        candidates = db_manager.get_all_candidates()
        return candidates
        
    except Exception as e:
        logger.error(f"Error fetching candidates: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch candidates")

@app.get("/candidates/{candidate_id}", response_model=CandidateResponse, tags=["Candidates"])
async def get_candidate(candidate_id: int):
    """Get a specific candidate by ID."""
    try:
        candidate = db_manager.get_candidate_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return candidate
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching candidate: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch candidate")

# Job management endpoints
@app.post("/create-job/", response_model=JobResponse, tags=["Jobs"])
async def create_job(job: JobRequest):
    """Create a new job posting."""
    try:
        # Prepare job data for database
        job_data = {
            'title': job.title,
            'requirements': job.requirements,
            'company': job.company,
            'location': job.location,
            'salary_range': job.salary_range,
            'job_type': job.job_type
        }
        
        # Insert into database
        job_id = db_manager.insert_job(job_data)
        
        # Fetch the created job
        created_job = db_manager.get_job_by_id(job_id)
        
        logger.info(f"Job created with ID: {job_id}")
        
        return created_job
        
    except Exception as e:
        logger.error(f"Error creating job: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create job: {str(e)}")

@app.get("/jobs/", response_model=List[JobResponse], tags=["Jobs"])
async def get_all_jobs():
    """Get all job postings."""
    try:
        jobs = db_manager.get_all_jobs()
        return jobs
        
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")

@app.get("/jobs/{job_id}", response_model=JobResponse, tags=["Jobs"])
async def get_job(job_id: int):
    """Get a specific job by ID."""
    try:
        job = db_manager.get_job_by_id(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching job: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch job")

# AI Matching endpoints
@app.get("/match-candidates/{job_id}", response_model=List[MatchResponse], tags=["Matching"])
async def match_candidates_to_job(job_id: int, limit: int = 3):
    """
    Find top candidate matches for a specific job using AI.
    """
    try:
        # Get job details
        job = db_manager.get_job_by_id(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get all candidates
        candidates = db_manager.get_all_candidates()
        if not candidates:
            return []
        
        # Use AI to match candidates
        matcher = get_talent_matcher()
        matches = matcher.match_candidates(job, candidates, limit=limit)
        
        # Store matches in database
        for match in matches:
            try:
                db_manager.insert_match(
                    candidate_id=match['candidate_id'],
                    job_id=job_id,
                    score=match['score'],
                    explanation=match['explanation'],
                    confidence=match.get('confidence', 0.0)
                )
            except Exception as e:
                logger.warning(f"Failed to store match in database: {e}")
        
        logger.info(f"Found {len(matches)} matches for job {job_id}")
        
        return matches
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error matching candidates: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to match candidates: {str(e)}")

@app.get("/matches/{job_id}", response_model=List[Dict[str, Any]], tags=["Matching"])
async def get_stored_matches(job_id: int):
    """Get previously computed matches for a job."""
    try:
        matches = db_manager.get_matches_for_job(job_id)
        return matches
        
    except Exception as e:
        logger.error(f"Error fetching stored matches: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch matches")

# Interest tracking endpoints
@app.post("/express-interest/", response_model=Dict[str, Any], tags=["Interest"])
async def express_interest(request: InterestRequest):
    """Record that a candidate is interested in a job."""
    try:
        # Verify candidate and job exist
        candidate = db_manager.get_candidate_by_id(request.candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        job = db_manager.get_job_by_id(request.job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Record interest
        interest_id = db_manager.insert_interest(
            candidate_id=request.candidate_id,
            job_id=request.job_id,
            status="interested"
        )
        
        logger.info(f"Interest recorded: Candidate {request.candidate_id} -> Job {request.job_id}")
        
        return {
            "success": True,
            "message": "Interest recorded successfully",
            "interest_id": interest_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error recording interest: {e}")
        raise HTTPException(status_code=500, detail="Failed to record interest")

@app.get("/candidate-interests/{candidate_id}", response_model=List[Dict[str, Any]], tags=["Interest"])
async def get_candidate_interests(candidate_id: int):
    """Get all jobs a candidate has shown interest in."""
    try:
        interests = db_manager.get_candidate_interests(candidate_id)
        return interests
        
    except Exception as e:
        logger.error(f"Error fetching candidate interests: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch interests")

# Utility endpoints
@app.post("/generate-job-requirements/", response_model=Dict[str, Any], tags=["Utility"])
async def generate_job_requirements(description: str = Form(...)):
    """
    Generate structured job requirements from natural language description.
    """
    try:
        matcher = get_talent_matcher()
        requirements = matcher.generate_job_requirements(description)
        
        return {
            "success": True,
            "requirements": requirements
        }
        
    except Exception as e:
        logger.error(f"Error generating job requirements: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate requirements: {str(e)}")

@app.delete("/reset-database/", response_model=Dict[str, Any], tags=["Utility"])
async def reset_database():
    """
    Reset database for demo purposes.
    WARNING: This deletes all data!
    """
    try:
        db_manager.clear_all_data()
        logger.info("Database reset completed")
        
        return {
            "success": True,
            "message": "Database reset successfully"
        }
        
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset database")

# Error handlers
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    """Handle Pydantic validation errors."""
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Run the application
if __name__ == "__main__":
    # Initialize database on startup
    try:
        db_manager.create_tables()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
    
    # Run FastAPI server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 