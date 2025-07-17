import React, { useState } from 'react';

const CandidateCard = ({
    candidate,
    onContactClick,
    showContactButton = true,
    isLoading = false,
    className = ''
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const getScoreColor = (score) => {
        if (score >= 85) return 'score-excellent';
        if (score >= 70) return 'score-good';
        if (score >= 50) return 'score-average';
        return 'score-poor';
    };

    const getMatchIcon = (category) => {
        switch (category) {
            case 'Strong Match':
                return '🎯';
            case 'Good Match':
                return '✅';
            case 'Potential Match':
                return '⭐';
            default:
                return '📋';
        }
    };

    const formatSkills = (skills) => {
        if (!skills) return [];

        if (typeof skills === 'string') {
            try {
                return JSON.parse(skills);
            } catch {
                return skills.split(',').map(s => s.trim());
            }
        }

        return Array.isArray(skills) ? skills : [];
    };

    const formatExperience = (experience) => {
        if (!experience) return 'Experience not specified';
        if (experience.length > 100) {
            return experience.substring(0, 100) + '...';
        }
        return experience;
    };

    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 card-hover ${className}`}>
            {/* Header with Score */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {candidate.candidate_name || candidate.name || 'Candidate'}
                        </h3>
                        {candidate.match_category && (
                            <span className="ml-2 text-lg">
                                {getMatchIcon(candidate.match_category)}
                            </span>
                        )}
                    </div>

                    {candidate.candidate_email && (
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {candidate.candidate_email}
                        </div>
                    )}
                </div>

                {/* Match Score */}
                {candidate.score !== undefined && (
                    <div className="ml-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
                            {candidate.score.toFixed(1)}%
                        </div>
                        {candidate.match_category && (
                            <div className="text-xs text-gray-500 mt-1">
                                {candidate.match_category}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Skills */}
            {(candidate.candidate_skills || candidate.skills) && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {formatSkills(candidate.candidate_skills || candidate.skills)
                            .slice(0, 8)
                            .map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {skill}
                                </span>
                            ))
                        }
                        {formatSkills(candidate.candidate_skills || candidate.skills).length > 8 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                +{formatSkills(candidate.candidate_skills || candidate.skills).length - 8} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Experience */}
            {(candidate.candidate_experience || candidate.experience) && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Experience:</h4>
                    <p className="text-gray-600 text-sm">
                        {formatExperience(candidate.candidate_experience || candidate.experience)}
                    </p>
                </div>
            )}

            {/* Match Explanation */}
            {candidate.explanation && (
                <div className="mb-4">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        <span>Match Analysis</span>
                        <svg
                            className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showDetails && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-md animate-fade-in">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {candidate.explanation}
                            </p>

                            {/* Confidence Score */}
                            {candidate.confidence && (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                    <span>Confidence: </span>
                                    <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${candidate.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="ml-2">{(candidate.confidence * 100).toFixed(0)}%</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Key Strengths */}
            {candidate.key_strengths && candidate.key_strengths.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strengths:</h4>
                    <ul className="text-sm text-gray-600">
                        {candidate.key_strengths.map((strength, index) => (
                            <li key={index} className="flex items-center mb-1">
                                <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    {candidate.linkedin_url ? (
                        <a
                            href={candidate.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
                            </svg>
                            LinkedIn Profile
                        </a>
                    ) : (
                        <span>Profile available</span>
                    )}
                </div>

                {showContactButton && (
                    <button
                        onClick={() => onContactClick && onContactClick(candidate)}
                        disabled={isLoading}
                        className={`
              inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                            }
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Candidate
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CandidateCard; 