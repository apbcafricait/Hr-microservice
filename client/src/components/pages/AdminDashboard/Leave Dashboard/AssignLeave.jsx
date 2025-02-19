import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const AssignLeave = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Assign Leave</h1>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Employee Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type for hints..."
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Leave Type and Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">-- Select --</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Leave Balance
                </label>
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                  0.00 Day(s)
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  From Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="yyyy-dd-mm"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  To Date<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="yyyy-dd-mm"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Required Text and Submit Button */}
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-500">* Required</p>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignLeave;