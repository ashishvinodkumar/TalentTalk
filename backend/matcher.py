"""
AI-powered talent matching engine for TalentTalk platform.
Uses OpenAI to intelligently match candidates with job requirements.
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from openai import OpenAI
from dotenv import load_dotenv
import math

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TalentMatcher:
    """
    AI-powered talent matching system that evaluates candidate-job fit.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the TalentMatcher with OpenAI API key.
        
        Args:
            api_key: OpenAI API key. If None, will try to get from environment.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
        
        # System prompt for matching evaluation
        self.matching_prompt = """You are an expert talent acquisition specialist and recruiter. Your job is to evaluate how well candidates match job requirements and provide detailed analysis.

Analyze the candidate-job fit based on:
1. Technical skills alignment (40% weight)
2. Experience relevance (30% weight)
3. Role/title match (20% weight)
4. Overall qualifications (10% weight)

For each match, provide:
- A score from 0-100 (100 being perfect match)
- Detailed explanation of strengths and potential concerns
- Specific skills/experience that align well
- Areas where the candidate might need development
- Overall recommendation (Strong Match/Good Match/Potential Match/Poor Match)

Be thorough but concise in your analysis. Focus on factual alignment rather than assumptions."""
    
    def match_candidates(self, job_requirements: Dict[str, Any], candidates: List[Dict[str, Any]], limit: int = 3) -> List[Dict[str, Any]]:
        """
        Match candidates to a job and return top matches with scores and explanations.
        
        Args:
            job_requirements: Dictionary containing job details and requirements
            candidates: List of candidate dictionaries
            limit: Maximum number of matches to return
            
        Returns:
            List of top matches with scores and explanations
        """
        try:
            logger.info(f"Matching {len(candidates)} candidates to job: {job_requirements.get('title', 'Unknown')}")
            
            matches = []
            
            for candidate in candidates:
                try:
                    # Calculate match score and get explanation
                    score, explanation, confidence = self._evaluate_candidate_match(job_requirements, candidate)
                    
                    match_result = {
                        "candidate_id": candidate.get("id"),
                        "candidate_name": candidate.get("name", "Unknown"),
                        "candidate_email": candidate.get("email", ""),
                        "candidate_skills": candidate.get("skills", []),
                        "candidate_experience": candidate.get("experience", ""),
                        "score": score,
                        "explanation": explanation,
                        "confidence": confidence,
                        "match_category": self._get_match_category(score),
                        "key_strengths": self._extract_key_strengths(explanation),
                        "areas_for_development": self._extract_development_areas(explanation)
                    }
                    
                    matches.append(match_result)
                    
                except Exception as e:
                    logger.error(f"Error evaluating candidate {candidate.get('name', 'Unknown')}: {e}")
                    continue
            
            # Sort by score (descending) and return top matches
            matches.sort(key=lambda x: x['score'], reverse=True)
            top_matches = matches[:limit]
            
            logger.info(f"Generated {len(top_matches)} matches for job")
            return top_matches
            
        except Exception as e:
            logger.error(f"Error in candidate matching: {e}")
            raise Exception(f"Failed to match candidates: {str(e)}")
    
    def calculate_match_score(self, job_requirements: Dict[str, Any], candidate: Dict[str, Any]) -> float:
        """
        Calculate a numerical match score between a candidate and job.
        
        Args:
            job_requirements: Job requirements and details
            candidate: Candidate information
            
        Returns:
            Match score between 0-100
        """
        try:
            score, _, _ = self._evaluate_candidate_match(job_requirements, candidate)
            return score
            
        except Exception as e:
            logger.error(f"Error calculating match score: {e}")
            return 0.0
    
    def generate_job_requirements(self, conversation_input: str) -> Dict[str, Any]:
        """
        Generate structured job requirements from conversational input.
        
        Args:
            conversation_input: Natural language description of job needs
            
        Returns:
            Structured job requirements dictionary
        """
        try:
            logger.info("Generating job requirements from conversation")
            
            generation_prompt = """Convert the following job description or requirements into a structured format. Extract and organize:

- Job title
- Required technical skills
- Experience level needed
- Key responsibilities
- Nice-to-have skills
- Company/industry context

Return a JSON object with these fields:
{
  "title": "Job Title",
  "required_skills": ["skill1", "skill2"],
  "experience_level": "Junior/Mid/Senior",
  "responsibilities": ["responsibility1", "responsibility2"],
  "nice_to_have": ["skill1", "skill2"],
  "company_context": "Brief description",
  "location": "Location if mentioned",
  "job_type": "Full-time/Part-time/Contract"
}

Input to convert:"""
            
            messages = [
                {"role": "system", "content": generation_prompt},
                {"role": "user", "content": conversation_input}
            ]
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.2,
                max_tokens=800
            )
            
            content = response.choices[0].message.content.strip()
            
            try:
                job_data = json.loads(content)
                logger.info(f"Generated job requirements for: {job_data.get('title', 'Unknown')}")
                return job_data
                
            except json.JSONDecodeError:
                # Fallback parsing
                return self._parse_job_requirements_fallback(conversation_input)
                
        except Exception as e:
            logger.error(f"Error generating job requirements: {e}")
            raise Exception(f"Failed to generate job requirements: {str(e)}")
    
    def _evaluate_candidate_match(self, job_requirements: Dict[str, Any], candidate: Dict[str, Any]) -> Tuple[float, str, float]:
        """
        Evaluate a single candidate against job requirements using AI.
        
        Args:
            job_requirements: Job requirements dictionary
            candidate: Candidate information dictionary
            
        Returns:
            Tuple of (score, explanation, confidence)
        """
        try:
            # Prepare candidate and job information for evaluation
            job_summary = self._format_job_for_evaluation(job_requirements)
            candidate_summary = self._format_candidate_for_evaluation(candidate)
            
            evaluation_prompt = f"""
Job Requirements:
{job_summary}

Candidate Profile:
{candidate_summary}

Evaluate this candidate's fit for the job. Provide:
1. A numerical score (0-100)
2. Detailed explanation of the match quality
3. Specific strengths and weaknesses
4. Overall recommendation

Format your response as JSON:
{{
  "score": 85,
  "explanation": "Detailed analysis...",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "Strong Match/Good Match/Potential Match/Poor Match",
  "confidence": 0.9
}}
"""
            
            messages = [
                {"role": "system", "content": self.matching_prompt},
                {"role": "user", "content": evaluation_prompt}
            ]
            
            response = self.client.chat.completions.create(
                model="gpt-4",  # Use GPT-4 for better evaluation quality
                messages=messages,
                temperature=0.1,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content.strip()
            
            try:
                evaluation = json.loads(content)
                score = float(evaluation.get("score", 0))
                explanation = evaluation.get("explanation", "No explanation provided")
                confidence = float(evaluation.get("confidence", 0.5))
                
                # Ensure score is within valid range
                score = max(0, min(100, score))
                confidence = max(0, min(1, confidence))
                
                return score, explanation, confidence
                
            except (json.JSONDecodeError, ValueError):
                # Fallback to simple scoring if JSON parsing fails
                return self._fallback_scoring(job_requirements, candidate)
                
        except Exception as e:
            logger.error(f"Error in AI evaluation: {e}")
            return self._fallback_scoring(job_requirements, candidate)
    
    def _format_job_for_evaluation(self, job_requirements: Dict[str, Any]) -> str:
        """Format job requirements for AI evaluation."""
        formatted = f"Title: {job_requirements.get('title', 'Unknown')}\n"
        formatted += f"Company: {job_requirements.get('company', 'Unknown')}\n"
        
        if job_requirements.get('requirements'):
            formatted += f"Requirements: {job_requirements['requirements']}\n"
        
        if job_requirements.get('required_skills'):
            formatted += f"Required Skills: {', '.join(job_requirements['required_skills'])}\n"
        
        if job_requirements.get('experience_level'):
            formatted += f"Experience Level: {job_requirements['experience_level']}\n"
        
        if job_requirements.get('location'):
            formatted += f"Location: {job_requirements['location']}\n"
        
        return formatted
    
    def _format_candidate_for_evaluation(self, candidate: Dict[str, Any]) -> str:
        """Format candidate information for AI evaluation."""
        formatted = f"Name: {candidate.get('name', 'Unknown')}\n"
        
        if candidate.get('skills'):
            if isinstance(candidate['skills'], str):
                formatted += f"Skills: {candidate['skills']}\n"
            else:
                formatted += f"Skills: {', '.join(candidate['skills'])}\n"
        
        if candidate.get('experience'):
            formatted += f"Experience: {candidate['experience']}\n"
        
        if candidate.get('summary'):
            formatted += f"Summary: {candidate['summary']}\n"
        
        # Include work experience if available
        if candidate.get('raw_data'):
            try:
                raw_data = json.loads(candidate['raw_data']) if isinstance(candidate['raw_data'], str) else candidate['raw_data']
                if raw_data.get('experience'):
                    formatted += "Work Experience:\n"
                    for exp in raw_data['experience'][:3]:  # Limit to top 3
                        formatted += f"- {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('duration', '')})\n"
            except:
                pass
        
        return formatted
    
    def _fallback_scoring(self, job_requirements: Dict[str, Any], candidate: Dict[str, Any]) -> Tuple[float, str, float]:
        """
        Fallback scoring method when AI evaluation fails.
        
        Args:
            job_requirements: Job requirements
            candidate: Candidate information
            
        Returns:
            Tuple of (score, explanation, confidence)
        """
        try:
            score = 0.0
            explanation_parts = []
            
            # Simple skill matching
            job_skills = set()
            if job_requirements.get('required_skills'):
                job_skills.update([s.lower().strip() for s in job_requirements['required_skills']])
            
            candidate_skills = set()
            if candidate.get('skills'):
                if isinstance(candidate['skills'], str):
                    # Try to parse JSON string or split by comma
                    try:
                        skills_list = json.loads(candidate['skills'])
                        candidate_skills.update([s.lower().strip() for s in skills_list])
                    except:
                        candidate_skills.update([s.lower().strip() for s in candidate['skills'].split(',')])
                else:
                    candidate_skills.update([s.lower().strip() for s in candidate['skills']])
            
            # Calculate skill overlap
            if job_skills and candidate_skills:
                skill_overlap = len(job_skills.intersection(candidate_skills))
                skill_score = (skill_overlap / len(job_skills)) * 70  # Max 70 points for skills
                score += skill_score
                explanation_parts.append(f"Skills match: {skill_overlap}/{len(job_skills)} required skills")
            
            # Basic experience check
            if candidate.get('experience'):
                score += 20  # Add 20 points for having experience
                explanation_parts.append("Candidate has relevant experience")
            
            # Add base score
            score += 10
            
            explanation = "; ".join(explanation_parts) if explanation_parts else "Basic compatibility assessment"
            
            return min(score, 100), explanation, 0.6
            
        except Exception as e:
            logger.error(f"Error in fallback scoring: {e}")
            return 25.0, "Unable to evaluate candidate match", 0.3
    
    def _get_match_category(self, score: float) -> str:
        """Get match category based on score."""
        if score >= 85:
            return "Strong Match"
        elif score >= 70:
            return "Good Match"
        elif score >= 50:
            return "Potential Match"
        else:
            return "Poor Match"
    
    def _extract_key_strengths(self, explanation: str) -> List[str]:
        """Extract key strengths from explanation text."""
        strengths = []
        if "strong" in explanation.lower():
            strengths.append("Strong technical skills")
        if "experience" in explanation.lower():
            strengths.append("Relevant experience")
        if "match" in explanation.lower():
            strengths.append("Good role alignment")
        return strengths[:3]  # Limit to top 3
    
    def _extract_development_areas(self, explanation: str) -> List[str]:
        """Extract development areas from explanation text."""
        areas = []
        if "lack" in explanation.lower() or "missing" in explanation.lower():
            areas.append("Some skill gaps identified")
        if "junior" in explanation.lower():
            areas.append("Could benefit from more experience")
        return areas[:2]  # Limit to top 2
    
    def _parse_job_requirements_fallback(self, input_text: str) -> Dict[str, Any]:
        """Fallback job requirements parsing."""
        return {
            "title": "Position",
            "required_skills": [],
            "experience_level": "Mid",
            "responsibilities": [],
            "nice_to_have": [],
            "company_context": input_text[:200] + "..." if len(input_text) > 200 else input_text,
            "location": "Remote",
            "job_type": "Full-time"
        }


def match_candidates_to_job(job_data: Dict[str, Any], candidates: List[Dict[str, Any]], api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Convenience function to match candidates to a job.
    
    Args:
        job_data: Job requirements and details
        candidates: List of candidate dictionaries
        api_key: Optional OpenAI API key
        
    Returns:
        List of top candidate matches
    """
    matcher = TalentMatcher(api_key=api_key)
    return matcher.match_candidates(job_data, candidates)


def generate_job_from_description(description: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Convenience function to generate job requirements from description.
    
    Args:
        description: Natural language job description
        api_key: Optional OpenAI API key
        
    Returns:
        Structured job requirements
    """
    matcher = TalentMatcher(api_key=api_key)
    return matcher.generate_job_requirements(description)


if __name__ == "__main__":
    # Test the matching engine
    print("🤖 Testing AI Talent Matching Engine")
    print("=" * 40)
    
    # Sample job requirements
    test_job = {
        "title": "Senior Python Developer",
        "company": "TechCorp",
        "requirements": "5+ years Python experience, Django, REST APIs, AWS deployment",
        "required_skills": ["Python", "Django", "REST APIs", "AWS"],
        "experience_level": "Senior"
    }
    
    # Sample candidates
    test_candidates = [
        {
            "id": 1,
            "name": "Alice Johnson",
            "email": "alice@example.com",
            "skills": ["Python", "Django", "Flask", "PostgreSQL", "AWS"],
            "experience": "6 years of Python development experience",
            "summary": "Senior Python developer with expertise in web frameworks"
        },
        {
            "id": 2,
            "name": "Bob Smith",
            "email": "bob@example.com", 
            "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
            "experience": "4 years of frontend development",
            "summary": "Frontend developer specializing in React applications"
        }
    ]
    
    try:
        matcher = TalentMatcher()
        matches = matcher.match_candidates(test_job, test_candidates)
        
        print("✅ Matching completed successfully!")
        print(f"Found {len(matches)} matches:")
        
        for i, match in enumerate(matches, 1):
            print(f"\n{i}. {match['candidate_name']} - Score: {match['score']:.1f}")
            print(f"   Category: {match['match_category']}")
            print(f"   Explanation: {match['explanation'][:100]}...")
            
    except Exception as e:
        print(f"❌ Testing failed: {e}")
        print("Note: Requires valid OpenAI API key in environment") 