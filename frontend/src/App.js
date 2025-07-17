import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidatePortal from './pages/CandidatePortal';
import HiringManagerPortal from './pages/HiringManagerPortal';
import Homepage from './components/Homepage';
import './App.css';

const Navigation = () => {
    const location = useLocation();

    // Don't show navigation on homepage
    if (location.pathname === '/') {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-white text-2xl font-bold">
                                TalentTalk
                            </h1>
                            <p className="text-blue-100 text-sm">Where talent speaks for itself</p>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/candidate"
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${location.pathname === '/candidate'
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-white hover:bg-blue-500 hover:bg-opacity-75'
                                }`}
                        >
                            Candidate Portal
                        </Link>
                        <Link
                            to="/hiring-manager"
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${location.pathname === '/hiring-manager'
                                ? 'bg-white text-purple-600 shadow-md'
                                : 'text-white hover:bg-purple-500 hover:bg-opacity-75'
                                }`}
                        >
                            Hiring Manager
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <div className="App min-h-screen bg-gray-50">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/candidate" element={<CandidatePortal />} />
                    <Route path="/hiring-manager" element={<HiringManagerPortal />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 