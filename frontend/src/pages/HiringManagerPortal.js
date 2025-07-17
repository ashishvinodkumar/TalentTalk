import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import CandidateCard from '../components/CandidateCard';

const HiringManagerPortal = () => {
    // State management
    const [activeTab, setActiveTab] = useState('create');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Job creation state
    const [jobForm, setJobForm] = useState({
        title: '',
        company: '',
        requirements: '',
        location: '',
        salary_range: '',
        job_type: 'Full-time'
    });

    // Jobs and matching state
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [matches, setMatches] = useState([]);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [contactedCandidates, setContactedCandidates] = useState(new Set());

    const loadJobs = useCallback(async () => {
        try {
            const jobsData = await apiService.job.getAll();
            setJobs(jobsData);

            // Auto-select first job if none selected
            if (!selectedJobId && jobsData.length > 0) {
                setSelectedJobId(jobsData[0].id.toString());
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            setError('Failed to load jobs');
        }
    }, [selectedJobId]);

    // Load jobs on component mount
    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const handleJobFormChange = (field, value) => {
        setJobForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();

        // Validation
        if (!jobForm.title.trim() || !jobForm.company.trim() || !jobForm.requirements.trim()) {
            setError('Please fill in all required fields (Title, Company, Requirements)');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const newJob = await apiService.job.create(jobForm);

            setSuccessMessage(`Job "${newJob.title}" created successfully!`);
            setJobs(prev => [newJob, ...prev]);

            // Reset form
            setJobForm({
                title: '',
                company: '',
                requirements: '',
                location: '',
                salary_range: '',
                job_type: 'Full-time'
            });

            // Switch to matching tab
            setActiveTab('match');
            setSelectedJobId(newJob.id.toString());

        } catch (error) {
            console.error('Error creating job:', error);
            setError(error.message || 'Failed to create job');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindMatches = async () => {
        if (!selectedJobId) {
            setError('Please select a job to find matches for');
            return;
        }

        try {
            setMatchingLoading(true);
            setError(null);
            setMatches([]);

            const matchesData = await apiService.matching.findMatches(selectedJobId, 3);

            setMatches(matchesData);
            setSuccessMessage(`Found ${matchesData.length} candidate matches!`);

        } catch (error) {
            console.error('Error finding matches:', error);
            setError(error.message || 'Failed to find candidate matches');
        } finally {
            setMatchingLoading(false);
        }
    };

    const handleContactCandidate = async (candidate) => {
        setContactedCandidates(prev => new Set(prev).add(candidate.candidate_id));
        setSuccessMessage(`Contact information revealed for ${candidate.candidate_name}!`);
    };

    const renderJobCreationForm = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Job Posting</h2>

            <form onSubmit={handleCreateJob} className="space-y-6">
                {/* Job Title */}
                <div>
                    <label className="form-label">Job Title *</label>
                    <input
                        type="text"
                        value={jobForm.title}
                        onChange={(e) => handleJobFormChange('title', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                </div>

                {/* Company */}
                <div>
                    <label className="form-label">Company *</label>
                    <input
                        type="text"
                        value={jobForm.company}
                        onChange={(e) => handleJobFormChange('company', e.target.value)}
                        placeholder="e.g., TechCorp Inc"
                        className="form-input"
                        disabled={isLoading}
                        required
                    />
                </div>

                {/* Requirements */}
                <div>
                    <label className="form-label">Job Requirements *</label>
                    <textarea
                        value={jobForm.requirements}
                        onChange={(e) => handleJobFormChange('requirements', e.target.value)}
                        placeholder="Describe the skills, experience, and qualifications needed for this role..."
                        rows={6}
                        className="form-textarea"
                        disabled={isLoading}
                        required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Be specific about required skills, years of experience, technologies, etc.
                    </p>
                </div>

                {/* Location and Job Type */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            value={jobForm.location}
                            onChange={(e) => handleJobFormChange('location', e.target.value)}
                            placeholder="e.g., San Francisco, CA / Remote"
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="form-label">Job Type</label>
                        <select
                            value={jobForm.job_type}
                            onChange={(e) => handleJobFormChange('job_type', e.target.value)}
                            className="form-input"
                            disabled={isLoading}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>

                {/* Salary Range */}
                <div>
                    <label className="form-label">Salary Range</label>
                    <input
                        type="text"
                        value={jobForm.salary_range}
                        onChange={(e) => handleJobFormChange('salary_range', e.target.value)}
                        placeholder="e.g., $100,000 - $150,000"
                        className="form-input"
                        disabled={isLoading}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Job...
                        </>
                    ) : (
                        'Create Job Posting'
                    )}
                </button>
            </form>
        </div>
    );

    const renderMatchingSection = () => (
        <div className="space-y-6">
            {/* Job Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Find Top Candidate Matches</h2>

                <div className="space-y-4">
                    {/* Job Dropdown */}
                    <div>
                        <label className="form-label">Select Job Position</label>
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="form-input"
                            disabled={matchingLoading}
                        >
                            <option value="">Choose a job...</option>
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title} at {job.company}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Find Matches Button */}
                    <button
                        onClick={handleFindMatches}
                        disabled={matchingLoading || !selectedJobId}
                        className="btn-primary"
                    >
                        {matchingLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Finding Matches...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Find Top 3 Matches
                            </>
                        )}
                    </button>

                    {/* AI Info */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-purple-800">AI-Powered Matching</h3>
                                <p className="mt-1 text-sm text-purple-700">
                                    Our AI analyzes candidate skills, experience, and qualifications to find the best matches for your role.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {matchingLoading && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <LoadingSpinner size="large" message="AI is analyzing candidates and finding the best matches..." />
                </div>
            )}

            {/* Matches Results */}
            {matches.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Top {matches.length} Candidate Matches
                    </h3>
                    <div className="grid gap-6">
                        {matches.map((candidate, index) => (
                            <div key={candidate.candidate_id} className="relative">
                                <div className="absolute -left-4 -top-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                    #{index + 1}
                                </div>
                                <CandidateCard
                                    candidate={candidate}
                                    onContactClick={handleContactCandidate}
                                    isLoading={false}
                                />

                                {/* Contact Information (revealed after contact button click) */}
                                {contactedCandidates.has(candidate.candidate_id) && (
                                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                                        <h4 className="font-medium text-green-800 mb-2">Contact Information</h4>
                                        <div className="space-y-1 text-sm text-green-700">
                                            <p><strong>Email:</strong> {candidate.candidate_email}</p>
                                            {candidate.linkedin_url && (
                                                <p>
                                                    <strong>LinkedIn:</strong>
                                                    <a
                                                        href={candidate.linkedin_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-1 text-blue-600 hover:text-blue-700 underline"
                                                    >
                                                        View Profile
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Matches State */}
            {!matchingLoading && matches.length === 0 && selectedJobId && (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                    <p className="text-gray-600">
                        Click "Find Top 3 Matches" to discover candidates that match your job requirements.
                    </p>
                </div>
            )}
        </div>
    );

    const renderJobsListSection = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your Job Postings</h2>
                <button
                    onClick={loadJobs}
                    className="btn-secondary"
                >
                    Refresh
                </button>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Posted</h3>
                    <p className="text-gray-600 mb-4">Create your first job posting to start finding candidates.</p>
                    <button
                        onClick={() => setActiveTab('create')}
                        className="btn-primary"
                    >
                        Create Job Posting
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-600">{job.company}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {job.job_type}
                                    </span>
                                    {job.salary_range && (
                                        <p className="text-sm text-green-600 mt-1">{job.salary_range}</p>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                {job.requirements.substring(0, 200)}
                                {job.requirements.length > 200 && '...'}
                            </p>

                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                                <button
                                    onClick={() => {
                                        setSelectedJobId(job.id.toString());
                                        setActiveTab('match');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Find Candidates →
                                </button>
                            </div>
                        </div>
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
                    <h1 className="text-3xl font-bold text-gray-900">Hiring Manager Portal</h1>
                    <p className="mt-2 text-gray-600">Create job postings and find the perfect candidates with AI-powered matching.</p>
                </div>

                {/* Messages */}
                <ErrorMessage
                    message={error}
                    onDismiss={() => setError(null)}
                    onRetry={() => {
                        if (activeTab === 'create') handleCreateJob();
                        else if (activeTab === 'match') handleFindMatches();
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
                            { id: 'create', name: 'Create Job', icon: '✍️' },
                            { id: 'match', name: 'Find Matches', icon: '🎯' },
                            { id: 'jobs', name: 'My Jobs', icon: '📋' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                                        ? 'border-purple-500 text-purple-600'
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
                    {activeTab === 'create' && renderJobCreationForm()}
                    {activeTab === 'match' && renderMatchingSection()}
                    {activeTab === 'jobs' && renderJobsListSection()}
                </div>
            </div>
        </div>
    );
};

export default HiringManagerPortal; 