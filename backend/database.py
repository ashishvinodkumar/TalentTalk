"""
Database setup and management for TalentTalk platform.
Creates SQLite database with proper schema and relationships.
"""

import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_PATH = "talent_match.db"

class DatabaseManager:
    def __init__(self, db_path: str = DATABASE_PATH):
        self.db_path = db_path
        
    def get_connection(self) -> sqlite3.Connection:
        """Get database connection with foreign key support enabled."""
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row  # Enable column access by name
        return conn
    
    def create_tables(self) -> None:
        """Create all necessary tables with proper relationships."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Create candidates table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS candidates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        skills TEXT NOT NULL,  -- JSON string of skills array
                        experience TEXT,       -- Years of experience or description
                        resume_path TEXT,      -- Path to uploaded resume file
                        linkedin_url TEXT,     -- LinkedIn profile URL
                        raw_data TEXT,         -- JSON string of all parsed data
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # Create jobs table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS jobs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        requirements TEXT NOT NULL,  -- Job requirements and description
                        company TEXT NOT NULL,
                        location TEXT,
                        salary_range TEXT,
                        job_type TEXT DEFAULT 'Full-time',  -- Full-time, Part-time, Contract
                        raw_requirements TEXT,       -- JSON string of structured requirements
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # Create matches table with foreign key constraints
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS matches (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        candidate_id INTEGER NOT NULL,
                        job_id INTEGER NOT NULL,
                        score REAL NOT NULL CHECK (score >= 0 AND score <= 100),
                        explanation TEXT,            -- AI explanation for the match
                        confidence REAL DEFAULT 0.0, -- Confidence level (0-1)
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
                        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
                        UNIQUE(candidate_id, job_id)  -- Prevent duplicate matches
                    )
                """)
                
                # Create interests table (candidate interest in jobs)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS interests (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        candidate_id INTEGER NOT NULL,
                        job_id INTEGER NOT NULL,
                        status TEXT DEFAULT 'interested',  -- interested, applied, contacted
                        notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
                        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
                        UNIQUE(candidate_id, job_id)  -- Prevent duplicate interests
                    )
                """)
                
                # Create indexes for better performance
                cursor.execute("CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email)")
                cursor.execute("CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score DESC)")
                cursor.execute("CREATE INDEX IF NOT EXISTS idx_matches_candidate_job ON matches(candidate_id, job_id)")
                cursor.execute("CREATE INDEX IF NOT EXISTS idx_interests_candidate_job ON interests(candidate_id, job_id)")
                
                conn.commit()
                logger.info("Database tables created successfully")
                
        except sqlite3.Error as e:
            logger.error(f"Error creating tables: {e}")
            raise
    
    def insert_candidate(self, candidate_data: Dict[str, Any]) -> int:
        """Insert a new candidate and return their ID."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO candidates (name, email, skills, experience, resume_path, linkedin_url, raw_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    candidate_data.get('name'),
                    candidate_data.get('email'),
                    candidate_data.get('skills', '[]'),  # JSON string
                    candidate_data.get('experience'),
                    candidate_data.get('resume_path'),
                    candidate_data.get('linkedin_url'),
                    candidate_data.get('raw_data', '{}')  # JSON string
                ))
                candidate_id = cursor.lastrowid
                conn.commit()
                logger.info(f"Inserted candidate with ID: {candidate_id}")
                return candidate_id
                
        except sqlite3.IntegrityError as e:
            logger.error(f"Candidate already exists: {e}")
            raise
        except sqlite3.Error as e:
            logger.error(f"Error inserting candidate: {e}")
            raise
    
    def upsert_candidate(self, candidate_data: Dict[str, Any]) -> tuple[int, bool]:
        """Insert a new candidate or update existing one by email. Returns (candidate_id, is_update)."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Check if candidate exists by email
                cursor.execute("SELECT id FROM candidates WHERE email = ?", (candidate_data.get('email'),))
                existing = cursor.fetchone()
                
                if existing:
                    # Update existing candidate
                    candidate_id = existing[0]
                    cursor.execute("""
                        UPDATE candidates 
                        SET name = ?, skills = ?, experience = ?, resume_path = ?, 
                            linkedin_url = ?, raw_data = ?, created_at = CURRENT_TIMESTAMP
                        WHERE email = ?
                    """, (
                        candidate_data.get('name'),
                        candidate_data.get('skills', '[]'),
                        candidate_data.get('experience'),
                        candidate_data.get('resume_path'),
                        candidate_data.get('linkedin_url'),
                        candidate_data.get('raw_data', '{}'),
                        candidate_data.get('email')
                    ))
                    logger.info(f"Updated existing candidate with ID: {candidate_id}")
                    is_update = True
                else:
                    # Insert new candidate
                    cursor.execute("""
                        INSERT INTO candidates (name, email, skills, experience, resume_path, linkedin_url, raw_data)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        candidate_data.get('name'),
                        candidate_data.get('email'),
                        candidate_data.get('skills', '[]'),
                        candidate_data.get('experience'),
                        candidate_data.get('resume_path'),
                        candidate_data.get('linkedin_url'),
                        candidate_data.get('raw_data', '{}')
                    ))
                    candidate_id = cursor.lastrowid
                    logger.info(f"Inserted new candidate with ID: {candidate_id}")
                    is_update = False
                
                conn.commit()
                return candidate_id, is_update
                
        except sqlite3.Error as e:
            logger.error(f"Error upserting candidate: {e}")
            raise
    
    def insert_job(self, job_data: Dict[str, Any]) -> int:
        """Insert a new job and return its ID."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO jobs (title, requirements, company, location, salary_range, job_type, raw_requirements)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    job_data.get('title'),
                    job_data.get('requirements'),
                    job_data.get('company'),
                    job_data.get('location'),
                    job_data.get('salary_range'),
                    job_data.get('job_type', 'Full-time'),
                    job_data.get('raw_requirements', '{}')  # JSON string
                ))
                job_id = cursor.lastrowid
                conn.commit()
                logger.info(f"Inserted job with ID: {job_id}")
                return job_id
                
        except sqlite3.Error as e:
            logger.error(f"Error inserting job: {e}")
            raise
    
    def insert_match(self, candidate_id: int, job_id: int, score: float, explanation: str = "", confidence: float = 0.0) -> int:
        """Insert a match between candidate and job."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO matches (candidate_id, job_id, score, explanation, confidence)
                    VALUES (?, ?, ?, ?, ?)
                """, (candidate_id, job_id, score, explanation, confidence))
                match_id = cursor.lastrowid
                conn.commit()
                logger.info(f"Inserted/updated match with ID: {match_id}")
                return match_id
                
        except sqlite3.Error as e:
            logger.error(f"Error inserting match: {e}")
            raise
    
    def insert_interest(self, candidate_id: int, job_id: int, status: str = "interested", notes: str = "") -> int:
        """Insert candidate interest in a job."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO interests (candidate_id, job_id, status, notes)
                    VALUES (?, ?, ?, ?)
                """, (candidate_id, job_id, status, notes))
                interest_id = cursor.lastrowid
                conn.commit()
                logger.info(f"Inserted/updated interest with ID: {interest_id}")
                return interest_id
                
        except sqlite3.Error as e:
            logger.error(f"Error inserting interest: {e}")
            raise
    
    def get_all_candidates(self) -> List[Dict[str, Any]]:
        """Get all candidates from database."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM candidates ORDER BY created_at DESC")
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching candidates: {e}")
            raise
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get all jobs from database."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching jobs: {e}")
            raise
    
    def get_candidate_by_id(self, candidate_id: int) -> Optional[Dict[str, Any]]:
        """Get candidate by ID."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
                row = cursor.fetchone()
                return dict(row) if row else None
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching candidate: {e}")
            raise
    
    def get_candidate_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get candidate by email."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM candidates WHERE email = ?", (email,))
                row = cursor.fetchone()
                return dict(row) if row else None
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching candidate by email: {e}")
            raise
    
    def get_job_by_id(self, job_id: int) -> Optional[Dict[str, Any]]:
        """Get job by ID."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
                row = cursor.fetchone()
                return dict(row) if row else None
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching job: {e}")
            raise
    
    def get_matches_for_job(self, job_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """Get top matches for a specific job."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT m.*, c.name, c.email, c.skills, c.experience, c.linkedin_url
                    FROM matches m
                    JOIN candidates c ON m.candidate_id = c.id
                    WHERE m.job_id = ?
                    ORDER BY m.score DESC
                    LIMIT ?
                """, (job_id, limit))
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching matches: {e}")
            raise
    
    def get_candidate_interests(self, candidate_id: int) -> List[Dict[str, Any]]:
        """Get all jobs a candidate has shown interest in."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT i.*, j.title, j.company, j.location
                    FROM interests i
                    JOIN jobs j ON i.job_id = j.id
                    WHERE i.candidate_id = ?
                    ORDER BY i.created_at DESC
                """, (candidate_id,))
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Error fetching interests: {e}")
            raise
    
    def clear_all_data(self) -> None:
        """Clear all data from all tables (for testing/demo reset)."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM interests")
                cursor.execute("DELETE FROM matches")
                cursor.execute("DELETE FROM jobs")
                cursor.execute("DELETE FROM candidates")
                conn.commit()
                logger.info("Cleared all data from database")
                
        except sqlite3.Error as e:
            logger.error(f"Error clearing data: {e}")
            raise


def init_database() -> None:
    """Initialize the database with all tables."""
    try:
        db_manager = DatabaseManager()
        db_manager.create_tables()
        print("✅ Database initialized successfully!")
        
        # Print table info
        with db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            print(f"📊 Created tables: {', '.join(tables)}")
            
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise


if __name__ == "__main__":
    init_database() 