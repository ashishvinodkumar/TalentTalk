import React from 'react';

const JobCard = ({
    job,
    onInterestedClick,
    isInterested = false,
    showInterestButton = true,
    isLoading = false,
    className = ''
}) => {
    const formatSalary = (salaryRange) => {
        if (!salaryRange) return 'Salary not specified';
        return salaryRange;
    };

    const formatLocation = (location) => {
        if (!location) return 'Location not specified';
        return location;
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 card-hover ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title || 'Job Title'}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {job.company || 'Company'}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {formatLocation(job.location)}
                        </div>
                    </div>
                </div>

                {/* Job Type Badge */}
                <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.job_type || 'Full-time'}
                    </span>
                </div>
            </div>

            {/* Salary */}
            {job.salary_range && (
                <div className="mb-4">
                    <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="font-medium">{formatSalary(job.salary_range)}</span>
                    </div>
                </div>
            )}

            {/* Requirements */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {truncateText(job.requirements)}
                </p>
            </div>

            {/* Skills (if available in raw_requirements) */}
            {job.raw_requirements && (() => {
                try {
                    const rawReq = typeof job.raw_requirements === 'string'
                        ? JSON.parse(job.raw_requirements)
                        : job.raw_requirements;

                    if (rawReq.required_skills && rawReq.required_skills.length > 0) {
                        return (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {rawReq.required_skills.slice(0, 6).map((skill, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {skill}
                                        </span>
                                    ))}
                                    {rawReq.required_skills.length > 6 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                            +{rawReq.required_skills.length - 6} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    }
                } catch (e) {
                    // Ignore JSON parsing errors
                }
                return null;
            })()}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    Posted: {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                </div>

                {showInterestButton && (
                    <button
                        onClick={() => onInterestedClick && onInterestedClick(job)}
                        disabled={isLoading || isInterested}
                        className={`
              inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
              ${isInterested
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500'
                            }
            `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Processing...
                            </>
                        ) : isInterested ? (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Interested
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                ❤️ Interested
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard; 