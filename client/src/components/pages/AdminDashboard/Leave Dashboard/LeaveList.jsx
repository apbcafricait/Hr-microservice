import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle, X, Search, Download, Trash2, Edit2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover } from '@headlessui/react';

const LeaveList = () => {
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });
  const [showCalendar, setShowCalendar] = useState({ from: false, to: false });
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employeeName: '',
    subUnit: '',
    includePastEmployees: false
  });

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      date: '2025-01-15',
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      balance: 15,
      days: 3,
      status: 'Pending',
      comments: 'Family vacation'
    },
    {
      id: 2,
      date: '2025-02-01',
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      balance: 10,
      days: 2,
      status: 'Approved',
      comments: 'Medical appointment'
    }
  ];

  const handleReset = () => {
    setDateRange({ from: '2025-01-01', to: '2025-12-31' });
    setFilters({
      status: '',
      leaveType: '',
      employeeName: '',
      subUnit: '',
      includePastEmployees: false
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-2xl font-bold text-indigo-900"
            >
              Leave List
            </motion.h1>
            <button className="text-gray-500 hover:text-indigo-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Date Range Pickers */}
            {['from', 'to'].map((type) => (
              <Popover key={type} className="relative">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-indigo-900">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Date
                  </label>
                  <Popover.Button className="w-full flex items-center px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <span className="flex-1 text-left text-gray-700">
                      {dateRange[type]}
                    </span>
                  
                  </Popover.Button>
                </div>
                <Popover.Panel className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-indigo-100 p-2">
                  <input
                    type="date"
                    value={dateRange[type]}
                    onChange={(e) => setDateRange({ ...dateRange, [type]: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </Popover.Panel>
              </Popover>
            ))}

            {/* Status Dropdown */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-indigo-900">Status</label>
                <HelpCircle className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-indigo-500" />
              </div>
            </div>

            {/* Leave Type Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-indigo-900">Leave Type</label>
              <div className="relative">
                <select
                  value={filters.leaveType}
                  onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">All Types</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-indigo-500" />
              </div>
            </div>

            {/* Employee Search */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-indigo-900">Employee Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={filters.employeeName}
                  onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-indigo-500" />
              </div>
            </div>

            {/* Past Employees Toggle */}
            <div className="flex items-center space-x-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includePastEmployees}
                  onChange={(e) => setFilters({ ...filters, includePastEmployees: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-indigo-900">Include Past Employees</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-indigo-600">* Required fields</p>
            <div className="space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Reset
              </button>
              <button className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-indigo-100">
            {mockData.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50">
                No Records Found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="w-4 p-4">
                      <input type="checkbox" className="rounded border-indigo-300" />
                    </th>
                    {['Date', 'Employee Name', 'Leave Type', 'Balance (Days)', 'Days', 'Status', 'Comments', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {mockData.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="p-4">
                        <input type="checkbox" className="rounded border-indigo-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.employeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.leaveType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.balance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.days}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.comments}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button className="p-1 text-indigo-600 hover:text-indigo-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-indigo-600 hover:text-indigo-900">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveList;