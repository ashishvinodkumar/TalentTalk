"""
Resume Parser using OpenAI API for extracting structured data from resumes.
Handles different resume formats and returns standardized JSON data.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResumeParser:
    """
    Resume parser that uses OpenAI to extract structured information from resume text.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the ResumeParser with OpenAI API key.
        
        Args:
            api_key: OpenAI API key. If None, will try to get from environment.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
        
        # Standard system prompt for resume parsing
        self.system_prompt = """You are an expert resume parser. Your job is to extract structured information from resume text and return it as valid JSON.

Extract the following information:
- name: Full name of the person
- email: Email address
- phone: Phone number if available
- skills: Array of technical and professional skills
- experience: Array of work experience objects with {title, company, duration, description}
- education: Array of education objects with {degree, institution, year}
- summary: Brief professional summary (2-3 sentences)

Return ONLY valid JSON with these fields. If information is not available, use null or empty arrays.
Be thorough in extracting skills - include technical skills, programming languages, frameworks, tools, and soft skills.
For experience, extract job titles, company names, duration, and key responsibilities."""

    def parse_resume(self, resume_text: str) -> Dict[str, Any]:
        """
        Parse resume text and extract structured information.
        
        Args:
            resume_text: Raw text content of the resume
            
        Returns:
            Dict containing extracted resume information
            
        Raises:
            Exception: If parsing fails or API call fails
        """
        try:
            logger.info("Starting resume parsing with OpenAI")
            
            # Prepare the messages for OpenAI
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"Parse this resume:\n\n{resume_text}"}
            ]
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.1,  # Low temperature for consistent parsing
                max_tokens=1500
            )
            
            # Extract the content with null checking
            raw_content = response.choices[0].message.content
            if not raw_content:
                logger.error("OpenAI response content is empty or None")
                return self._get_default_resume_data()
            
            content = raw_content.strip()
            if not content:
                logger.error("OpenAI response content is empty after stripping")
                return self._get_default_resume_data()
            
            # Parse JSON response
            try:
                parsed_data = json.loads(content)
                logger.info("Successfully parsed resume data")
                
                # Validate and clean the data
                return self._validate_and_clean_data(parsed_data)
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                logger.error(f"Raw response: {content}")
                
                # Try to extract JSON from response if it contains other text
                return self._extract_json_from_response(content)
                
        except Exception as e:
            logger.error(f"Error parsing resume: {e}")
            logger.warning("Returning default resume data due to parsing error")
            return self._get_default_resume_data()
    
    def extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from any text input (job descriptions, profiles, etc.).
        
        Args:
            text: Text to extract skills from
            
        Returns:
            List of extracted skills
        """
        try:
            logger.info("Extracting skills from text")
            
            skills_prompt = """Extract all technical skills, programming languages, frameworks, tools, and relevant professional skills from the following text. Return only a JSON array of skills, nothing else.

Focus on:
- Programming languages (Python, JavaScript, Java, etc.)
- Frameworks and libraries (React, Django, Spring, etc.)
- Tools and platforms (AWS, Docker, Git, etc.)
- Technical skills (Machine Learning, Database Design, etc.)
- Professional skills (Project Management, Leadership, etc.)

Example format: ["Python", "React", "AWS", "Machine Learning", "Project Management"]"""
            
            messages = [
                {"role": "system", "content": skills_prompt},
                {"role": "user", "content": text}
            ]
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.1,
                max_tokens=500
            )
            
            # Extract content with null checking
            raw_content = response.choices[0].message.content
            if not raw_content:
                logger.warning("OpenAI skills response content is empty or None")
                return []
            
            content = raw_content.strip()
            if not content:
                logger.warning("OpenAI skills response content is empty after stripping")
                return []
            
            try:
                skills = json.loads(content)
                return skills if isinstance(skills, list) else []
            except json.JSONDecodeError:
                logger.warning("Failed to parse skills JSON, returning empty list")
                return []
                
        except Exception as e:
            logger.error(f"Error extracting skills: {e}")
            return []
    
    def _validate_and_clean_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and clean the parsed resume data.
        
        Args:
            data: Raw parsed data from OpenAI
            
        Returns:
            Cleaned and validated data
        """
        # Ensure all required fields exist with null checking
        cleaned_data = {
            "name": (data.get("name") or "").strip(),
            "email": (data.get("email") or "").strip(),
            "phone": (data.get("phone") or "").strip(),
            "skills": data.get("skills", []),
            "experience": data.get("experience", []),
            "education": data.get("education", []),
            "summary": (data.get("summary") or "").strip()
        }
        
        # Clean skills array
        if isinstance(cleaned_data["skills"], list):
            cleaned_data["skills"] = [(skill or "").strip() for skill in cleaned_data["skills"] if (skill or "").strip()]
        else:
            cleaned_data["skills"] = []
        
        # Clean experience array
        if isinstance(cleaned_data["experience"], list):
            for exp in cleaned_data["experience"]:
                if isinstance(exp, dict):
                    exp["title"] = (exp.get("title") or "").strip()
                    exp["company"] = (exp.get("company") or "").strip()
                    exp["duration"] = (exp.get("duration") or "").strip()
                    exp["description"] = (exp.get("description") or "").strip()
        else:
            cleaned_data["experience"] = []
        
        # Clean education array
        if isinstance(cleaned_data["education"], list):
            for edu in cleaned_data["education"]:
                if isinstance(edu, dict):
                    edu["degree"] = (edu.get("degree") or "").strip()
                    edu["institution"] = (edu.get("institution") or "").strip()
                    edu["year"] = (edu.get("year") or "").strip()
        else:
            cleaned_data["education"] = []
        
        return cleaned_data
    
    def _get_default_resume_data(self) -> Dict[str, Any]:
        """
        Return default/fallback resume data when parsing fails.
        
        Returns:
            Default resume data structure
        """
        return {
            "name": "Unknown",
            "email": "",
            "phone": "",
            "skills": [],
            "experience": [],
            "education": [],
            "summary": "Resume parsing failed. Please try uploading again or contact support."
        }
    
    def _extract_json_from_response(self, response: str) -> Dict[str, Any]:
        """
        Try to extract JSON from a response that might contain other text.
        
        Args:
            response: Raw response from OpenAI
            
        Returns:
            Extracted JSON data or default structure
        """
        try:
            # Look for JSON blocks in the response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response[start_idx:end_idx]
                return json.loads(json_str)
                
        except Exception as e:
            logger.error(f"Failed to extract JSON from response: {e}")
        
        # Return default structure if extraction fails
        return {
            "name": "",
            "email": "",
            "phone": "",
            "skills": [],
            "experience": [],
            "education": [],
            "summary": ""
        }
    
    def generate_candidate_summary(self, candidate_data: Dict[str, Any]) -> str:
        """
        Generate a professional summary for a candidate based on their data.
        
        Args:
            candidate_data: Structured candidate information
            
        Returns:
            Generated professional summary
        """
        try:
            summary_prompt = f"""Based on the following candidate information, write a concise 2-3 sentence professional summary:

Name: {candidate_data.get('name', 'Unknown')}
Skills: {', '.join(candidate_data.get('skills', []))}
Experience: {len(candidate_data.get('experience', []))} positions
Latest Role: {candidate_data.get('experience', [{}])[0].get('title', 'N/A') if candidate_data.get('experience') else 'N/A'}

Write a professional summary highlighting their key strengths and experience."""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": summary_prompt}],
                temperature=0.3,
                max_tokens=200
            )
            
            content = response.choices[0].message.content
            return (content or "").strip()
            
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            return "Experienced professional with diverse skills and background."


def parse_resume_file(file_content: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Convenience function to parse resume content.
    
    Args:
        file_content: Text content of the resume
        api_key: Optional OpenAI API key
        
    Returns:
        Parsed resume data
    """
    parser = ResumeParser(api_key=api_key)
    return parser.parse_resume(file_content)


def extract_skills_from_text(text: str, api_key: Optional[str] = None) -> List[str]:
    """
    Convenience function to extract skills from text.
    
    Args:
        text: Text to extract skills from
        api_key: Optional OpenAI API key
        
    Returns:
        List of extracted skills
    """
    parser = ResumeParser(api_key=api_key)
    return parser.extract_skills(text)


if __name__ == "__main__":
    # Test the resume parser with sample text
    sample_resume = """
    John Doe
    john.doe@email.com
    (555) 123-4567
    
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5 years of experience in full-stack development.
    
    EXPERIENCE
    Senior Software Engineer - Tech Corp (2020-2023)
    - Developed React applications with TypeScript
    - Built REST APIs using Python and Django
    - Managed AWS infrastructure and deployments
    
    Software Developer - StartupXYZ (2018-2020)
    - Created web applications using JavaScript and Node.js
    - Worked with PostgreSQL databases
    - Implemented CI/CD pipelines
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology (2018)
    
    SKILLS
    Python, JavaScript, React, Django, AWS, PostgreSQL, Docker, Git
    """
    
    try:
        parser = ResumeParser()
        result = parser.parse_resume(sample_resume)
        print("✅ Resume parsing test successful!")
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"❌ Resume parsing test failed: {e}") 