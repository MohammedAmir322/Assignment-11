import React from 'react';
import { useNavigate } from 'react-router';


const Error = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <svg width="80" height="80" viewBox="0 0 24 24" className="mb-4 text-red-500">
                <circle cx="12" cy="12" r="10" fill="#fee2e2" />
                <text x="12" y="16" textAnchor="middle" fontSize="24" fill="#ef4444" fontFamily="Arial">!</text>
            </svg>
            <h1 className="text-3xl font-bold mb-2 text-red-600">404 - Page Not Found</h1>
            <p className="mb-6 text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <button
                className="btn btn-primary"
                onClick={() => navigate('/')}
            >
                Home
            </button>
        </div>
    );
};

export default Error;