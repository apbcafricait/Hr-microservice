import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Management Dashboard</h1>
        <div className="flex flex-wrap gap-4">
          {/* Dashboard Section */}
          <Link to="/dashboard" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Dashboard</h2>
          </Link>

          {/* Apply Leave Section */}
          <Link to="/apply-leave" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Apply Leave</h2>
          </Link>

          {/* Leave Requests Section */}
          <Link to="/leave-requests" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave Requests</h2>
          </Link>

          {/* Leave History Section */}
          <Link to="/leave-history" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave History</h2>
          </Link>

          {/* Leave Approval Section */}
          <Link to="/leave-approval" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave Approval</h2>
          </Link>

          {/* Leave Balance Section */}
          <Link to="/leave-balance" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave Balance</h2>
          </Link>

          {/* Leave Type Management Section */}
          <Link to="/leave-type-management" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave Type Management</h2>
          </Link>

          {/* Leave Settings Section */}
          <Link to="/leave-settings" className="bg-white px-4 py-2 shadow rounded-md text-center hover:bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Leave Settings</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
