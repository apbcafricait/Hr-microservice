import React, { useState } from 'react';
import {  ChevronDown, ArrowUpDown, Search, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from 'framer-motion';

const MyLeaveList = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const statusOptions = [
    { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-gray-500' },
    { id: 'pending', label: 'Pending Approval', color: 'bg-yellow-500' },
    { id: 'scheduled', label: 'Scheduled', color: 'bg-blue-500' },
    { id: 'taken', label: 'Taken', color: 'bg-green-500' },
  ];

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Maternity Leave',
    'Paternity Leave',
  ];

  // Sample data for the table
  const sampleData = [
    {
      id: 1,
      date: '2024-01-15',
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      balance: 10,
      days: 2,
      status: 'pending',
      comments: 'Family vacation',
    },
    // Add more sample data as needed
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-6 transition-colors duration-300`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Leave List</h1>
         
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6 mb-6`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                From Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholderText="Select start date"
                />
               
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                To Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholderText="Select end date"
                  minDate={fromDate}
                />
                
              </div>
            </div>

            {/* Leave Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Show Leave with Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {statusOptions.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center bg-opacity-10 rounded-full px-3 py-1"
                    style={{ backgroundColor: status.color }}
                  >
                    <span className="text-xs">{status.label}</span>
                    <div className={`w-2 h-2 rounded-full ml-2 ${status.color}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">* Required</span>
            <div className="space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 flex items-center"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setLeaveStatus('');
                  setLeaveType('');
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="text-sm mb-4">
          <span className="font-medium">(22)</span> Records Found
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="w-10 p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </th>
                  {[
                    'Date',
                    'Employee Name',
                    'Leave Type',
                    'Leave Balance (Days)',
                    'Number of Days',
                    'Status',
                    'Comments',
                    'Actions',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-sm font-medium"
                    >
                      <div className="flex items-center">
                        {header}
                        <ArrowUpDown className="w-4 h-4 ml-1 cursor-pointer hover:text-indigo-500" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {sampleData.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{row.date}</td>
                    <td className="px-4 py-3 text-sm">{row.employeeName}</td>
                    <td className="px-4 py-3 text-sm">{row.leaveType}</td>
                    <td className="px-4 py-3 text-sm">{row.balance}</td>
                    <td className="px-4 py-3 text-sm">{row.days}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        statusOptions.find(s => s.id === row.status)?.color
                      } bg-opacity-10`}>
                        {statusOptions.find(s => s.id === row.status)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{row.comments}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Eye className="w-4 h-4 cursor-pointer hover:text-indigo-500" />
                        <Edit className="w-4 h-4 cursor-pointer hover:text-indigo-500" />
                        <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyLeaveList;