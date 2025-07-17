"""
Sample data generator for TalentTalk platform demo.
Creates realistic candidates and job postings for hackathon presentation.
"""

import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

from database import DatabaseManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SampleDataGenerator:
    """
    Generate realistic sample data for demo purposes.
    """
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        
        # Sample candidate profiles
        self.sample_candidates = [
            {
                "name": "Sarah Chen",
                "email": "sarah.chen@email.com",
                "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "AWS", "Data Analysis", "Deep Learning", "Pandas", "Scikit-learn"],
                "experience": "6 years of experience as a Data Scientist specializing in machine learning and AI solutions",
                "summary": "Passionate data scientist with 6+ years of experience in machine learning and AI. Led multiple successful projects in predictive analytics and deep learning.",
                "linkedin_url": "https://linkedin.com/in/sarah-chen-data-scientist",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Senior Data Scientist",
                            "company": "TechFlow Inc",
                            "duration": "2021 - Present",
                            "description": "Leading ML initiatives for product recommendations, improving user engagement by 35%"
                        },
                        {
                            "title": "Data Scientist",
                            "company": "DataCorp",
                            "duration": "2018 - 2021",
                            "description": "Developed predictive models for customer churn, saving $2M annually"
                        }
                    ],
                    "education": [
                        {
                            "degree": "MS in Data Science",
                            "institution": "Stanford University",
                            "year": "2018"
                        }
                    ]
                }
            },
            {
                "name": "Marcus Johnson",
                "email": "marcus.johnson@email.com",
                "skills": ["JavaScript", "React", "Node.js", "Python", "PostgreSQL", "MongoDB", "Docker", "Git", "TypeScript", "Redux"],
                "experience": "5 years of full-stack development experience with modern web technologies",
                "summary": "Versatile full-stack developer with expertise in modern web technologies. Strong background in both frontend and backend development.",
                "linkedin_url": "https://linkedin.com/in/marcus-johnson-dev",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Senior Full Stack Developer",
                            "company": "WebSolutions LLC",
                            "duration": "2020 - Present",
                            "description": "Built scalable web applications serving 100K+ users using React and Node.js"
                        },
                        {
                            "title": "Frontend Developer",
                            "company": "StartupXYZ",
                            "duration": "2018 - 2020",
                            "description": "Developed responsive web interfaces and improved user experience"
                        }
                    ],
                    "education": [
                        {
                            "degree": "BS in Computer Science",
                            "institution": "University of Texas",
                            "year": "2018"
                        }
                    ]
                }
            },
            {
                "name": "Emily Rodriguez",
                "email": "emily.rodriguez@email.com",
                "skills": ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Python", "Bash", "Monitoring", "CI/CD", "Linux"],
                "experience": "6 years of DevOps and cloud infrastructure experience",
                "summary": "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines. Passionate about automation and scalable systems.",
                "linkedin_url": "https://linkedin.com/in/emily-rodriguez-devops",
                "raw_data": {
                    "experience": [
                        {
                            "title": "DevOps Engineer",
                            "company": "CloudTech Solutions",
                            "duration": "2019 - Present",
                            "description": "Managed AWS infrastructure for microservices architecture serving millions of requests"
                        },
                        {
                            "title": "Systems Administrator",
                            "company": "TechCorp",
                            "duration": "2017 - 2019",
                            "description": "Maintained server infrastructure and implemented monitoring solutions"
                        }
                    ],
                    "education": [
                        {
                            "degree": "BS in Information Technology",
                            "institution": "University of Washington",
                            "year": "2017"
                        }
                    ]
                }
            },
            {
                "name": "David Kim",
                "email": "david.kim@email.com",
                "skills": ["Product Strategy", "User Research", "Data Analysis", "Agile", "Scrum", "SQL", "A/B Testing", "Roadmapping", "Stakeholder Management"],
                "experience": "7 years of product management experience driving product vision and execution",
                "summary": "Strategic product manager with 7+ years of experience driving product vision and execution. Expert in user research and data-driven decision making.",
                "linkedin_url": "https://linkedin.com/in/david-kim-pm",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Senior Product Manager",
                            "company": "ProductCo",
                            "duration": "2020 - Present",
                            "description": "Led product strategy for B2B SaaS platform, increasing revenue by 40%"
                        },
                        {
                            "title": "Product Manager",
                            "company": "InnovateTech",
                            "duration": "2017 - 2020",
                            "description": "Managed product roadmap and collaborated with engineering teams"
                        }
                    ],
                    "education": [
                        {
                            "degree": "MBA",
                            "institution": "Columbia Business School",
                            "year": "2017"
                        }
                    ]
                }
            },
            {
                "name": "Jessica Wang",
                "email": "jessica.wang@email.com",
                "skills": ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "HTML", "CSS", "UI/UX Design", "Wireframing"],
                "experience": "6 years of UX/UI design experience creating intuitive user interfaces",
                "summary": "Creative UX/UI designer with passion for user-centered design. Experienced in designing intuitive interfaces for web and mobile applications.",
                "linkedin_url": "https://linkedin.com/in/jessica-wang-ux",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Senior UX Designer",
                            "company": "DesignStudio",
                            "duration": "2019 - Present",
                            "description": "Led UX design for mobile app with 500K+ downloads, improving user retention by 25%"
                        },
                        {
                            "title": "UI Designer",
                            "company": "CreativeAgency",
                            "duration": "2017 - 2019",
                            "description": "Designed user interfaces for various client projects"
                        }
                    ],
                    "education": [
                        {
                            "degree": "BFA in Graphic Design",
                            "institution": "Art Center College of Design",
                            "year": "2017"
                        }
                    ]
                }
            },
            {
                "name": "Alex Thompson",
                "email": "alex.thompson@email.com",
                "skills": ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis", "Apache Kafka", "REST APIs", "GraphQL", "Maven", "JUnit"],
                "experience": "8 years of backend Java development experience with enterprise systems",
                "summary": "Senior backend engineer with expertise in Java ecosystem and distributed systems. Strong experience in building scalable microservices.",
                "linkedin_url": "https://linkedin.com/in/alex-thompson-java",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Senior Backend Engineer",
                            "company": "EnterpriseComp",
                            "duration": "2019 - Present",
                            "description": "Architected microservices handling 10M+ daily transactions"
                        },
                        {
                            "title": "Java Developer",
                            "company": "FinTechSolutions",
                            "duration": "2016 - 2019",
                            "description": "Developed banking APIs and payment processing systems"
                        }
                    ],
                    "education": [
                        {
                            "degree": "MS in Computer Science",
                            "institution": "Carnegie Mellon University",
                            "year": "2016"
                        }
                    ]
                }
            },
            {
                "name": "Maria Garcia",
                "email": "maria.garcia@email.com",
                "skills": ["Flutter", "Dart", "iOS", "Android", "Swift", "Kotlin", "React Native", "Mobile UI/UX", "Firebase", "REST APIs"],
                "experience": "4 years of mobile app development experience across iOS and Android platforms",
                "summary": "Mobile app developer specializing in cross-platform development. Passionate about creating beautiful and performant mobile experiences.",
                "linkedin_url": "https://linkedin.com/in/maria-garcia-mobile",
                "raw_data": {
                    "experience": [
                        {
                            "title": "Mobile App Developer",
                            "company": "MobileFirst",
                            "duration": "2020 - Present",
                            "description": "Built Flutter apps with 1M+ downloads across app stores"
                        },
                        {
                            "title": "iOS Developer",
                            "company": "AppStudio",
                            "duration": "2019 - 2020",
                            "description": "Developed native iOS applications for various clients"
                        }
                    ],
                    "education": [
                        {
                            "degree": "BS in Software Engineering",
                            "institution": "University of California, Berkeley",
                            "year": "2019"
                        }
                    ]
                }
            }
        ]
        
        # Sample job postings
        self.sample_jobs = [
            {
                "title": "Senior Data Scientist",
                "company": "AI Innovations Inc",
                "requirements": "5+ years of data science experience with Python, machine learning frameworks (TensorFlow, PyTorch), and experience with cloud platforms. Strong background in statistical analysis and model deployment.",
                "location": "San Francisco, CA (Remote)",
                "salary_range": "$120,000 - $160,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Statistics", "SQL"],
                    "experience_level": "Senior",
                    "nice_to_have": ["AWS", "MLOps", "Deep Learning", "Computer Vision"]
                }
            },
            {
                "title": "Full Stack Developer",
                "company": "TechStartup Co",
                "requirements": "3+ years of full-stack development experience with React, Node.js, and database technologies. Experience with modern development practices and cloud deployment.",
                "location": "Austin, TX",
                "salary_range": "$90,000 - $130,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["React", "Node.js", "JavaScript", "PostgreSQL", "Git"],
                    "experience_level": "Mid",
                    "nice_to_have": ["TypeScript", "Docker", "AWS", "GraphQL"]
                }
            },
            {
                "title": "DevOps Engineer",
                "company": "CloudScale Systems",
                "requirements": "4+ years of DevOps experience with AWS, Docker, Kubernetes, and CI/CD pipelines. Strong automation and infrastructure-as-code experience.",
                "location": "Seattle, WA (Hybrid)",
                "salary_range": "$110,000 - $150,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
                    "experience_level": "Senior",
                    "nice_to_have": ["Python", "Monitoring", "Security", "Ansible"]
                }
            },
            {
                "title": "Product Manager",
                "company": "Growth Dynamics",
                "requirements": "5+ years of product management experience with B2B SaaS products. Strong analytical skills and experience with user research and data-driven decision making.",
                "location": "New York, NY",
                "salary_range": "$130,000 - $170,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["Product Strategy", "User Research", "Data Analysis", "Agile", "Stakeholder Management"],
                    "experience_level": "Senior",
                    "nice_to_have": ["SQL", "A/B Testing", "Roadmapping", "Technical Background"]
                }
            },
            {
                "title": "UX/UI Designer",
                "company": "DesignForward Agency",
                "requirements": "4+ years of UX/UI design experience with modern design tools. Portfolio showcasing web and mobile design projects. Strong user research background.",
                "location": "Los Angeles, CA",
                "salary_range": "$85,000 - $115,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["Figma", "User Research", "Prototyping", "UI/UX Design", "Wireframing"],
                    "experience_level": "Mid",
                    "nice_to_have": ["HTML/CSS", "Animation", "Mobile Design", "Design Systems"]
                }
            },
            {
                "title": "Backend Java Developer",
                "company": "Enterprise Solutions Ltd",
                "requirements": "6+ years of Java development experience with Spring framework, microservices architecture, and database design. Experience with enterprise-scale applications.",
                "location": "Chicago, IL",
                "salary_range": "$105,000 - $140,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["Java", "Spring Boot", "Microservices", "PostgreSQL", "REST APIs"],
                    "experience_level": "Senior",
                    "nice_to_have": ["Apache Kafka", "Redis", "Docker", "GraphQL"]
                }
            },
            {
                "title": "Mobile App Developer",
                "company": "MobileFirst Innovations",
                "requirements": "3+ years of mobile app development experience with Flutter or React Native. Experience publishing apps to app stores and working with mobile UI/UX principles.",
                "location": "Remote",
                "salary_range": "$80,000 - $110,000",
                "job_type": "Full-time",
                "raw_requirements": {
                    "required_skills": ["Flutter", "Dart", "Mobile Development", "Firebase", "REST APIs"],
                    "experience_level": "Mid",
                    "nice_to_have": ["iOS", "Android", "React Native", "Mobile UI/UX"]
                }
            }
        ]
    
    def populate_database(self, reset_first: bool = True) -> None:
        """
        Populate database with sample data.
        
        Args:
            reset_first: Whether to clear existing data first
        """
        try:
            if reset_first:
                logger.info("Clearing existing data...")
                self.db_manager.clear_all_data()
            
            # Insert sample candidates
            logger.info("Inserting sample candidates...")
            candidate_ids = []
            
            for candidate_data in self.sample_candidates:
                # Prepare data for database insertion
                db_candidate_data = {
                    'name': candidate_data['name'],
                    'email': candidate_data['email'],
                    'skills': json.dumps(candidate_data['skills']),
                    'experience': candidate_data['experience'],
                    'linkedin_url': candidate_data.get('linkedin_url'),
                    'raw_data': json.dumps(candidate_data.get('raw_data', {}))
                }
                
                candidate_id = self.db_manager.insert_candidate(db_candidate_data)
                candidate_ids.append(candidate_id)
                logger.info(f"Inserted candidate: {candidate_data['name']} (ID: {candidate_id})")
            
            # Insert sample jobs
            logger.info("Inserting sample jobs...")
            job_ids = []
            
            for job_data in self.sample_jobs:
                # Prepare data for database insertion
                db_job_data = {
                    'title': job_data['title'],
                    'company': job_data['company'],
                    'requirements': job_data['requirements'],
                    'location': job_data.get('location'),
                    'salary_range': job_data.get('salary_range'),
                    'job_type': job_data.get('job_type', 'Full-time'),
                    'raw_requirements': json.dumps(job_data.get('raw_requirements', {}))
                }
                
                job_id = self.db_manager.insert_job(db_job_data)
                job_ids.append(job_id)
                logger.info(f"Inserted job: {job_data['title']} at {job_data['company']} (ID: {job_id})")
            
            # Generate some sample interests
            logger.info("Generating sample interests...")
            self._generate_sample_interests(candidate_ids, job_ids)
            
            logger.info("✅ Sample data population completed successfully!")
            
            # Print summary
            print(f"\n📊 Data Summary:")
            print(f"   • {len(candidate_ids)} candidates added")
            print(f"   • {len(job_ids)} jobs added")
            print(f"   • Sample interests generated")
            
        except Exception as e:
            logger.error(f"Error populating database: {e}")
            raise
    
    def _generate_sample_interests(self, candidate_ids: List[int], job_ids: List[int]) -> None:
        """Generate some sample candidate interests in jobs."""
        try:
            # Generate random interests (each candidate interested in 1-3 jobs)
            for candidate_id in candidate_ids:
                num_interests = random.randint(1, 3)
                interested_jobs = random.sample(job_ids, min(num_interests, len(job_ids)))
                
                for job_id in interested_jobs:
                    try:
                        self.db_manager.insert_interest(
                            candidate_id=candidate_id,
                            job_id=job_id,
                            status="interested"
                        )
                    except Exception as e:
                        logger.warning(f"Failed to insert interest: {e}")
                        continue
            
            logger.info("Sample interests generated")
            
        except Exception as e:
            logger.error(f"Error generating sample interests: {e}")
    
    def get_data_summary(self) -> Dict[str, Any]:
        """Get summary of current database data."""
        try:
            candidates = self.db_manager.get_all_candidates()
            jobs = self.db_manager.get_all_jobs()
            
            return {
                "candidates_count": len(candidates),
                "jobs_count": len(jobs),
                "sample_candidates": [c['name'] for c in candidates],
                "sample_jobs": [f"{j['title']} at {j['company']}" for j in jobs]
            }
            
        except Exception as e:
            logger.error(f"Error getting data summary: {e}")
            return {"error": str(e)}


def create_sample_resumes() -> Dict[str, str]:
    """
    Create sample resume texts for testing the resume parser.
    
    Returns:
        Dictionary mapping candidate names to resume text
    """
    sample_resumes = {
        "John Doe": """
        John Doe
        john.doe@email.com
        (555) 123-4567
        
        PROFESSIONAL SUMMARY
        Senior software engineer with 5+ years of experience in full-stack development.
        
        EXPERIENCE
        Senior Software Engineer - TechCorp (2020-2023)
        • Developed React applications with TypeScript
        • Built REST APIs using Python and Django
        • Managed AWS infrastructure and deployments
        • Led team of 3 junior developers
        
        Software Developer - StartupXYZ (2018-2020)
        • Created web applications using JavaScript and Node.js
        • Worked with PostgreSQL and MongoDB databases
        • Implemented CI/CD pipelines using Jenkins
        
        EDUCATION
        Bachelor of Science in Computer Science
        University of Technology (2018)
        
        SKILLS
        Python, JavaScript, React, Django, AWS, PostgreSQL, Docker, Git, TypeScript, Node.js
        """,
        
        "Jane Smith": """
        Jane Smith
        jane.smith@email.com
        (555) 987-6543
        
        PROFESSIONAL SUMMARY
        Data scientist with expertise in machine learning and statistical analysis.
        
        EXPERIENCE
        Senior Data Scientist - DataCorp (2019-Present)
        • Developed predictive models improving customer retention by 25%
        • Built recommendation systems using collaborative filtering
        • Deployed ML models to production using MLflow and AWS
        • Collaborated with product teams on A/B testing
        
        Data Analyst - Analytics Inc (2017-2019)
        • Performed statistical analysis on large datasets
        • Created dashboards and reports using Tableau
        • Automated data pipelines using Python and SQL
        
        EDUCATION
        Master of Science in Data Science
        Stanford University (2017)
        
        SKILLS
        Python, R, Machine Learning, TensorFlow, Scikit-learn, SQL, Tableau, AWS, Statistics
        """
    }
    
    return sample_resumes


def main():
    """Main function to populate database with sample data."""
    try:
        print("🚀 TalentTalk Sample Data Generator")
        print("=" * 40)
        
        # Initialize data generator
        generator = SampleDataGenerator()
        
        # Initialize database tables
        generator.db_manager.create_tables()
        
        # Populate with sample data
        generator.populate_database(reset_first=True)
        
        # Print summary
        summary = generator.get_data_summary()
        print(f"\n✅ Database populated successfully!")
        print(f"📈 Summary: {summary['candidates_count']} candidates, {summary['jobs_count']} jobs")
        
        print("\n🎯 Sample Candidates:")
        for name in summary['sample_candidates']:
            print(f"   • {name}")
        
        print("\n💼 Sample Jobs:")
        for job in summary['sample_jobs']:
            print(f"   • {job}")
        
        print("\n🎭 Note: This is demo data for hackathon presentation")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        logger.error(f"Failed to populate sample data: {e}")


if __name__ == "__main__":
    main() 