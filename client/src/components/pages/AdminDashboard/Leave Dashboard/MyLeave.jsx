import React, { useState } from 'react';
import { Calendar, ChevronDown, ArrowUpDown } from 'lucide-react';

const MyLeaveList = () => {
  const [fromDate, setFromDate] = useState('01-01-2025');
  const [toDate, setToDate] = useState('12-31-2025');
  const [leaveStatus, setLeaveStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');

  const statusOptions = [
    { id: 'rejected', label: 'Rejected' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'pending', label: 'Pending Approval' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'taken', label: 'Taken' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-gray-700 text-lg font-medium">My Leave List</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                From Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                To Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Show Leave with Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Show Leave with Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {statusOptions.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                  >
                    <span className="text-xs text-gray-600">{status.label}</span>
                    <div className="w-2 h-2 bg-gray-400 rounded-full ml-2"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">-- Select --</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">* Required</span>
            <div className="space-x-3">
              <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                Reset
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-gray-600 mb-4">
          (22) Records Found
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 p-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    Employee Name
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    Leave Type
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Leave Balance (Days)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Number of Days
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Comments
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Table rows would be mapped here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyLeaveList;