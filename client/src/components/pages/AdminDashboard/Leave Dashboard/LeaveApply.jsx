import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle } from 'lucide-react';

const LeaveApplication = () => {
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [comments, setComments] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-400 to-orange-300 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-white font-medium">Leave</span>
         
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-2">
            <button className="px-4 py-2 bg-orange-50 text-orange-500 rounded-md">Apply</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">My Leave</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center">
              Configure
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Leave List</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Assign Leave</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl text-gray-700 mb-6">Apply Leave</h1>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Leave Type<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={selectedLeaveType}
                    onChange={(e) => setSelectedLeaveType(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  From Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm-dd-yyyy"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Leave Balance */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Leave Balance</label>
                <div className="text-gray-700">0.00 Day(s)</div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  To Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm-dd-yyyy"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">Comments</label>
            <textarea
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="4"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          {/* Required Fields Note */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">* Required</span>
            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Apply
            </button>
          </div>
        </div>
      </main>

      {/* Help Button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default LeaveApplication;