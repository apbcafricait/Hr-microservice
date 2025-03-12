import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotAuthorized;