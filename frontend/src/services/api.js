import axios from 'axios';

// Configure axios with base URL and default settings
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging and authentication
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.data || error.message);

        // Handle common errors
        if (error.response?.status === 404) {
            console.error('Resource not found');
        } else if (error.response?.status === 500) {
            console.error('Server error occurred');
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        }

        return Promise.reject(error);
    }
);

// Utility function to handle API errors
const handleApiError = (error, defaultMessage = 'An error occurred') => {
    if (error.response?.data?.detail) {
        return error.response.data.detail;
    } else if (error.message) {
        return error.message;
    }
    return defaultMessage;
};

// Utility function for retry logic
const withRetry = async (apiCall, maxRetries = 2) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            console.warn(`API call failed (attempt ${attempt}/${maxRetries}), retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
    }
};

// Health check endpoints
export const healthApi = {
    check: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Health check failed'));
        }
    },

    root: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Server not responding'));
        }
    }
};

// Candidate management endpoints
export const candidateApi = {
    uploadResume: async (file, email) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('email', email);

            const response = await api.post('/upload-resume/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 1 minute for file upload
            });

            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to upload resume'));
        }
    },

    importLinkedIn: async (profileUrl) => {
        try {
            const response = await withRetry(() =>
                api.post('/import-linkedin/', { profile_url: profileUrl })
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to import LinkedIn profile'));
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/candidates/');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch candidates'));
        }
    },

    getById: async (candidateId) => {
        try {
            const response = await api.get(`/candidates/${candidateId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch candidate'));
        }
    },

    getInterests: async (candidateId) => {
        try {
            const response = await api.get(`/candidate-interests/${candidateId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch candidate interests'));
        }
    }
};

// Job management endpoints
export const jobApi = {
    create: async (jobData) => {
        try {
            const response = await api.post('/create-job/', jobData);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to create job'));
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/jobs/');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch jobs'));
        }
    },

    getById: async (jobId) => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch job'));
        }
    },

    generateRequirements: async (description) => {
        try {
            const formData = new FormData();
            formData.append('description', description);

            const response = await api.post('/generate-job-requirements/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to generate job requirements'));
        }
    }
};

// AI matching endpoints
export const matchingApi = {
    findMatches: async (jobId, limit = 3) => {
        try {
            const response = await withRetry(() =>
                api.get(`/match-candidates/${jobId}?limit=${limit}`)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to find candidate matches'));
        }
    },

    getStoredMatches: async (jobId) => {
        try {
            const response = await api.get(`/matches/${jobId}`);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to fetch stored matches'));
        }
    }
};

// Interest tracking endpoints
export const interestApi = {
    express: async (candidateId, jobId) => {
        try {
            const response = await api.post('/express-interest/', {
                candidate_id: candidateId,
                job_id: jobId
            });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to express interest'));
        }
    }
};

// Utility endpoints
export const utilityApi = {
    resetDatabase: async () => {
        try {
            const response = await api.delete('/reset-database/');
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error, 'Failed to reset database'));
        }
    }
};

// Combined API object for easy import
const apiService = {
    health: healthApi,
    candidate: candidateApi,
    job: jobApi,
    matching: matchingApi,
    interest: interestApi,
    utility: utilityApi,

    // Direct axios instance for custom requests
    axios: api,

    // Utility functions
    handleError: handleApiError,
    withRetry: withRetry
};

export default apiService; 