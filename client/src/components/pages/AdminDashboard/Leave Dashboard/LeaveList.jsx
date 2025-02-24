import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle, X, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllLeaveRequestsQuery, useDeleteLeaveRequestMutation } from '../../../../slices/leaveApiSlice';

const LeaveList = () => {
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employeeName: '',
    includePastEmployees: false,
  });

  // Fetch leave requests from backend
  const { data: leaveRequests, isLoading, error, refetch } = useGetAllLeaveRequestsQuery();
  const [deleteLeaveRequest, { isLoading: isDeleting }] = useDeleteLeaveRequestMutation();

  const handleReset = () => {
    setDateRange({ from: '2025-01-01', to: '2025-12-31' });
    setFilters({
      status: '',
      leaveType: '',
      employeeName: '',
      includePastEmployees: false,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteLeaveRequest(id).unwrap();
      console.log(`Leave request ${id} deleted successfully`);
      toast.success('Leave request deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      refetch();
    } catch (err) {
      console.error('Failed to delete leave request:', err);
      toast.error('Failed to delete leave request.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = leaveRequests?.data?.leaveRequests?.filter((request) => {
    const startDate = new Date(request.startDate);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    const matchesDate = startDate >= fromDate && startDate <= toDate;
    const matchesStatus = filters.status ? request.status === filters.status : true;
    const matchesType = filters.leaveType ? request.type === filters.leaveType : true;
    const matchesName = filters.employeeName
      ? `${request.employee.firstName} ${request.employee.lastName}`
          .toLowerCase()
          .includes(filters.employeeName.toLowerCase())
      : true;

    return matchesDate && matchesStatus && matchesType && matchesName;
  }) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8"
    >
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-2xl sm:text-3xl font-bold text-indigo-900 tracking-tight"
            >
              Leave Requests
            </motion.h1>
            <button className="text-gray-500 hover:text-indigo-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Date Range Pickers */}
            {['from', 'to'].map((type) => (
              <Popover key={type} className="relative">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-indigo-900">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Date
                  </label>
                  <Popover.Button className="w-full flex items-center px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm">
                    <span className="flex-1 text-left text-gray-700">{dateRange[type]}</span>
                    <Calendar className="w-5 h-5 text-indigo-500" />
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
              <label className="text-sm font-medium text-indigo-900">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
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
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                >
                  <option value="">All Types</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
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
                  className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
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
                <span className="ml-3 text-sm font-medium text-indigo-900">Past Employees</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-sm text-indigo-600">* Filter to narrow results</p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-2.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-indigo-100 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 text-lg animate-pulse">
                Loading leave requests...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">Error loading data: {error.message}</div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50">
                No Records Found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-indigo-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="w-4 p-4">
                      <input type="checkbox" className="rounded border-indigo-300" />
                    </th>
                    {['Date', 'Employee', 'Type', 'Days', 'Status', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {filteredData.map((request) => {
                    const days = Math.ceil(
                      (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)
                    ) + 1;
                    return (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-indigo-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {`${request.employee.firstName} ${request.employee.lastName}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{days}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 text-indigo-600 hover:text-indigo-900"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDelete(request.id)}
                              disabled={isDeleting}
                              className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
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