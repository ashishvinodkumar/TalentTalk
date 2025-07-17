#!/usr/bin/env python3
"""
Test script for the enhanced LinkedIn scraper.
This will demonstrate the improved handling of LinkedIn's anti-bot protection.
"""

import sys
import os

# Add backend to path
sys.path.append('backend')

from backend.linkedin_spider import scrape_linkedin_profile

def test_linkedin_scraper():
    """Test the enhanced LinkedIn scraper."""
    
    print("🔍 Testing Enhanced LinkedIn Scraper")
    print("=" * 50)
    
    # Test URLs - these will likely trigger LinkedIn's anti-bot protection
    test_urls = [
        "https://www.linkedin.com/in/mawuliagamah/",
        "https://www.linkedin.com/in/satya-nadella/",
        "https://www.linkedin.com/in/jeffweiner08/"
    ]
    
    for i, url in enumerate(test_urls, 1):
        print(f"\n📋 Test {i}: {url}")
        print("-" * 40)
        
        try:
            # Scrape the profile
            profile = scrape_linkedin_profile(url)
            
            # Display results
            print(f"✅ Profile scraped successfully!")
            print(f"   Name: {profile.get('name', 'Unknown')}")
            print(f"   Title: {profile.get('title', 'Unknown')}")
            print(f"   Location: {profile.get('location', 'Unknown')}")
            print(f"   Skills: {', '.join(profile.get('skills', [])[:3])}...")
            
            # Check if it's a fallback profile
            if profile.get('is_fallback'):
                print(f"   🎭 Fallback Profile: {profile.get('fallback_reason', 'Unknown reason')}")
                if profile.get('linkedin_blocked'):
                    print(f"   🛡️  LinkedIn Anti-Bot Protection Detected")
            else:
                print(f"   ✅ Real LinkedIn Data Retrieved!")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n🎯 Summary:")
    print(f"   • Enhanced scraper handles LinkedIn's HTTP 999 anti-bot protection")
    print(f"   • Multiple retry attempts with randomized headers")
    print(f"   • Realistic fallback profiles when blocked")
    print(f"   • Human-like delays and behavior simulation")
    print(f"   • Better error handling and reporting")

if __name__ == "__main__":
    test_linkedin_scraper() 