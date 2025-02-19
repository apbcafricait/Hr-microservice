import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle, Plus, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PerformanceReviewPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedInclude, setSelectedInclude] = useState('Current Employees Only');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Navigation */}
      <div className="mb-8 flex items-center space-x-8 border-b border-gray-200 pb-4">
        <button className="text-gray-600 hover:text-gray-800">Configure</button>
        <button className="text-orange-500 font-medium">Manage Reviews</button>
        <button className="text-gray-600 hover:text-gray-800">My Trackers</button>
        <button className="text-gray-600 hover:text-gray-800">Employee Trackers</button>
        <div className="ml-auto">
          <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between cursor-pointer border-b border-gray-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-medium text-gray-700">Manage Performance Reviews</h2>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Filter Form */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type for hints..."
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <div className="relative">
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="manager">Manager</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Review Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Status
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Include */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Include
                </label>
                <div className="relative">
                  <select
                    value={selectedInclude}
                    onChange={(e) => setSelectedInclude(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Current Employees Only">Current Employees Only</option>
                    <option value="All Employees">All Employees</option>
                    <option value="Former Employees">Former Employees</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Reviewer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reviewer
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type for hints..."
                />
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="2025-01-01"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="2025-12-31"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                Reset
              </button>
              <button className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Search
              </button>
            </div>
          </motion.div>
        )}

        {/* Add Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center space-x-2 bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="text-gray-500 text-sm">No Records Found</div>
          <table className="min-w-full mt-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-8 px-4 py-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Employee
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Job Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Review Period
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Reviewer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Review Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewPage;