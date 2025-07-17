import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import UploadButton from '../components/UploadButton';
import JobCard from '../components/JobCard';

const CandidatePortal = () => {
    // State management
    const [activeTab, setActiveTab] = useState('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Resume upload state
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [candidateData, setCandidateData] = useState(null);

    // LinkedIn import state
    const [linkedinUrl, setLinkedinUrl] = useState('');

    // Jobs state
    const [jobs, setJobs] = useState([]);
    const [interestedJobs, setInterestedJobs] = useState(new Set());
    const [jobsLoading, setJobsLoading] = useState(false);

    // Load jobs on component mount
    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setJobsLoading(true);
            const jobsData = await apiService.job.getAll();
            setJobs(jobsData);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setError('Failed to load job listings');
        } finally {
            setJobsLoading(false);
        }
    };

    const handleResumeUpload = async () => {
        if (!selectedFile || !email.trim()) {
            setError('Please select a file and enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const result = await apiService.candidate.uploadResume(selectedFile, email.trim());

            setCandidateData(result.parsed_data);
            setSuccessMessage('Resume uploaded and parsed successfully!');
            setActiveTab('profile');

            // Clear form
            setSelectedFile(null);
            setEmail('');

        } catch (error) {
            console.error('Resume upload error:', error);
            setError(error.message || 'Failed to upload resume');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkedInImport = async () => {
        if (!linkedinUrl.trim()) {
            setError('Please enter a LinkedIn profile URL');
            return;
        }

        // Basic URL validation
        if (!linkedinUrl.includes('linkedin.com/in/')) {
            setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const result = await apiService.candidate.importLinkedIn(linkedinUrl.trim());

            setCandidateData(result.profile_data);
            setSuccessMessage('LinkedIn profile imported successfully!');
            setActiveTab('profile');

            // Clear form
            setLinkedinUrl('');

        } catch (error) {
            console.error('LinkedIn import error:', error);
            setError(error.message || 'Failed to import LinkedIn profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJobInterest = async (job) => {
        if (!candidateData) {
            setError('Please upload your resume or import LinkedIn profile first');
            return;
        }

        try {
            setIsLoading(true);

            await apiService.interest.express(candidateData.candidate_id || 1, job.id);

            setInterestedJobs(prev => new Set(prev).add(job.id));
            setSuccessMessage(`Interest expressed in ${job.title} at ${job.company}!`);

        } catch (error) {
            console.error('Error expressing interest:', error);
            setError(error.message || 'Failed to express interest');
        } finally {
            setIsLoading(false);
        }
    };

    const renderUploadSection = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Resume</h2>

            <div className="space-y-6">
                {/* Email Input */}
                <div>
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="form-input"
                        disabled={isLoading}
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="form-label">Resume File</label>
                    <div className="mt-2">
                        <UploadButton
                            onFileSelect={setSelectedFile}
                            isLoading={isLoading}
                            acceptedTypes=".pdf,.txt,.doc,.docx"
                        >
                            {selectedFile ? selectedFile.name : 'Choose Resume File'}
                        </UploadButton>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Supported formats: PDF, TXT, DOC, DOCX (max 10MB)
                    </p>
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleResumeUpload}
                    disabled={isLoading || !selectedFile || !email.trim()}
                    className="btn-primary w-full"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading and Parsing...
                        </>
                    ) : (
                        'Upload and Parse Resume'
                    )}
                </button>
            </div>
        </div>
    );

    const renderLinkedInSection = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Import LinkedIn Profile</h2>

            <div className="space-y-6">
                {/* LinkedIn URL Input */}
                <div>
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="form-input"
                        disabled={isLoading}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your full LinkedIn profile URL
                    </p>
                </div>

                {/* Import Button */}
                <button
                    onClick={handleLinkedInImport}
                    disabled={isLoading || !linkedinUrl.trim()}
                    className="btn-primary w-full"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Importing Profile...
                        </>
                    ) : (
                        'Import LinkedIn Profile'
                    )}
                </button>

                {/* Demo Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
                            <p className="mt-1 text-sm text-blue-700">
                                This will generate sample profile data for demonstration purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfileSection = () => {
        if (!candidateData) {
            return (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Data</h3>
                    <p className="text-gray-600">Upload your resume or import your LinkedIn profile to see your parsed information here.</p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Profile</h2>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Name</label>
                                <p className="text-gray-900 font-medium">{candidateData.name || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <p className="text-gray-900">{candidateData.email || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    {candidateData.skills && candidateData.skills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {candidateData.skills.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {candidateData.summary && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{candidateData.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {candidateData.experience && candidateData.experience.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Experience</h3>
                            <div className="space-y-4">
                                {candidateData.experience.map((exp, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-medium text-gray-900">{exp.title}</h4>
                                        <p className="text-blue-600 text-sm">{exp.company} • {exp.duration}</p>
                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderJobsSection = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Available Jobs</h2>
                <button
                    onClick={loadJobs}
                    disabled={jobsLoading}
                    className="btn-secondary"
                >
                    {jobsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {jobsLoading ? (
                <LoadingSpinner message="Loading job listings..." />
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Available</h3>
                    <p className="text-gray-600">Check back later for new job opportunities.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onInterestedClick={handleJobInterest}
                            isInterested={interestedJobs.has(job.id)}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Candidate Portal</h1>
                    <p className="mt-2 text-gray-600">Upload your resume, import your LinkedIn profile, and discover amazing job opportunities.</p>
                </div>

                {/* Messages */}
                <ErrorMessage
                    message={error}
                    onDismiss={() => setError(null)}
                    onRetry={() => {
                        if (activeTab === 'upload') handleResumeUpload();
                        else if (activeTab === 'linkedin') handleLinkedInImport();
                        else if (activeTab === 'jobs') loadJobs();
                    }}
                />
                <SuccessMessage
                    message={successMessage}
                    onDismiss={() => setSuccessMessage(null)}
                />

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {[
                            { id: 'upload', name: 'Upload Resume', icon: '📄' },
                            { id: 'linkedin', name: 'Import LinkedIn', icon: '💼' },
                            { id: 'profile', name: 'My Profile', icon: '👤' },
                            { id: 'jobs', name: 'Browse Jobs', icon: '🎯' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                `}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'upload' && renderUploadSection()}
                    {activeTab === 'linkedin' && renderLinkedInSection()}
                    {activeTab === 'profile' && renderProfileSection()}
                    {activeTab === 'jobs' && renderJobsSection()}
                </div>
            </div>
        </div>
    );
};

export default CandidatePortal; 