# TalentTalk Frontend

Modern React frontend for the TalentTalk AI-powered talent matching platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- TalentTalk backend running on http://localhost:8000

### Setup and Run

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Run the startup script (Recommended):**
```bash
./start_frontend.sh
```

3. **Manual setup (Alternative):**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at http://localhost:3000

## 🏗️ Architecture

### Tech Stack
- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Project Structure
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── LoadingSpinner.js
│   │   ├── ErrorMessage.js
│   │   ├── SuccessMessage.js
│   │   ├── UploadButton.js
│   │   ├── JobCard.js
│   │   └── CandidateCard.js
│   ├── pages/              # Main page components
│   │   ├── CandidatePortal.js
│   │   └── HiringManagerPortal.js
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.js              # Main app component
│   ├── App.css             # Custom styles
│   └── index.js            # App entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## 🎯 Features

### Candidate Portal
- **Resume Upload**: Upload PDF, DOC, TXT files with AI parsing
- **LinkedIn Import**: Import profile data (demo mode with mock data)
- **Profile View**: View parsed candidate information
- **Job Browsing**: Browse available jobs and express interest

### Hiring Manager Portal
- **Job Creation**: Create detailed job postings with requirements
- **AI Matching**: Find top 3 candidate matches using AI
- **Candidate Review**: View detailed candidate profiles with match scores
- **Contact Management**: Reveal candidate contact information

### Shared Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states, success/error messages
- **Modern UI**: Professional design with smooth animations
- **API Integration**: Comprehensive backend integration

## 🎨 UI Components

### LoadingSpinner
```jsx
<LoadingSpinner size="large" message="Finding matches..." />
```

### ErrorMessage
```jsx
<ErrorMessage 
  message={error} 
  onRetry={handleRetry} 
  onDismiss={() => setError(null)} 
/>
```

### SuccessMessage
```jsx
<SuccessMessage 
  message={success} 
  onDismiss={() => setSuccess(null)} 
/>
```

### UploadButton
```jsx
<UploadButton 
  onFileSelect={handleFileSelect}
  acceptedTypes=".pdf,.doc,.txt"
  isLoading={uploading}
>
  Choose File
</UploadButton>
```

### JobCard
```jsx
<JobCard 
  job={jobData}
  onInterestedClick={handleInterest}
  isInterested={false}
  isLoading={false}
/>
```

### CandidateCard
```jsx
<CandidateCard 
  candidate={candidateData}
  onContactClick={handleContact}
  showContactButton={true}
/>
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Custom color palette
- Extended animations
- Responsive breakpoints
- Custom utilities

### API Configuration
Service layer in `src/services/api.js`:
- Centralized API endpoints
- Request/response interceptors
- Error handling
- Retry logic

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- Collapsible navigation
- Touch-friendly buttons
- Optimized layouts
- Readable typography

## 🔄 State Management

### Component State
Uses React hooks for local state:
- `useState` for form data and UI state
- `useEffect` for data fetching
- Custom state logic for complex interactions

### API State
- Loading states for all async operations
- Error handling with user feedback
- Success confirmations
- Optimistic updates where appropriate

## 🚀 Performance

### Optimizations
- Component lazy loading
- Image optimization
- CSS purging in production
- Bundle splitting
- Efficient re-renders

### Best Practices
- Memoization for expensive calculations
- Debounced API calls
- Proper dependency arrays
- Clean up effects

## 🧪 Testing

### Manual Testing Checklist
- [ ] Resume upload works with different file types
- [ ] LinkedIn import returns demo data
- [ ] Job creation form validation
- [ ] AI matching finds candidates
- [ ] Interest tracking works
- [ ] Contact reveal functionality
- [ ] Responsive design on different screen sizes
- [ ] Error handling for API failures

### Testing Commands
```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎭 Demo Mode

### Mock Data Features
- LinkedIn scraper returns realistic demo profiles
- Sample candidates and jobs pre-loaded
- AI matching uses mock scoring
- No real external API calls required

### Demo Flow
1. Upload sample resume or import LinkedIn
2. View parsed profile data
3. Browse available jobs
4. Express interest in positions
5. (Hiring Manager) Create new job posting
6. Use AI to find top candidate matches
7. Review match explanations and scores
8. Contact selected candidates

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Style
- ES6+ JavaScript
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling
- Detailed comments for complex logic

### Adding New Features

1. **New Component:**
```jsx
// src/components/NewComponent.js
import React from 'react';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="custom-styling">
      {/* Component content */}
    </div>
  );
};

export default NewComponent;
```

2. **New API Endpoint:**
```javascript
// src/services/api.js
export const newApi = {
  newEndpoint: async (data) => {
    try {
      const response = await api.post('/new-endpoint/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Operation failed'));
    }
  }
};
```

3. **New Page:**
```jsx
// src/pages/NewPage.js
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const NewPage = () => {
  // Component logic
  return (
    <div className="container">
      {/* Page content */}
    </div>
  );
};

export default NewPage;
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Deploy `build` folder
- **AWS S3**: Upload `build` folder to S3 bucket
- **Docker**: Use included Dockerfile

## 🔍 Troubleshooting

### Common Issues

**Backend Connection Error:**
```
Error: Network Error
```
- Ensure backend is running on http://localhost:8000
- Check CORS configuration in backend
- Verify API endpoint URLs

**File Upload Fails:**
```
Error: Failed to upload resume
```
- Check file size (max 10MB)
- Verify file type (PDF, DOC, TXT, DOCX)
- Ensure backend upload endpoint is working

**Tailwind Styles Not Working:**
- Ensure PostCSS is configured correctly
- Check if Tailwind directives are imported in CSS
- Verify Tailwind config file

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors if using TS
- Verify all imports are correct

### Debug Mode
Add console logs in development:
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📞 Support

For development questions:
1. Check browser console for errors
2. Verify backend API is responding
3. Test with sample data
4. Check network requests in DevTools

## 🎯 Future Enhancements

### Planned Features
- Real-time notifications
- Advanced search and filtering
- Candidate recommendation engine
- Interview scheduling
- Analytics dashboard
- Mobile app version

### Performance Improvements
- Service worker for offline support
- Progressive Web App features
- Advanced caching strategies
- Lazy loading for large datasets

## 🤝 Contributing

1. Follow existing code style
2. Add comprehensive error handling
3. Test on multiple screen sizes
4. Update documentation for new features
5. Ensure accessibility compliance 