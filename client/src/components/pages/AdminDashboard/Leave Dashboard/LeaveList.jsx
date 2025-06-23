import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle, X, Search, Eye, Edit2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, Disclosure } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllLeaveRequestsOfOrganisationQuery } from '../../../../slices/leaveApiSlice';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../../slices/employeeSlice';
import { saveAs } from 'file-saver';

// Mock mutation hooks (replace with actual API mutations for approve/reject)
const useUpdateLeaveRequestStatusMutation = () => {
  return {
    mutateAsync: async ({ id, status }) => {
      // Simulate API call
      return new Promise((resolve) => setTimeout(() => resolve({ id, status }), 500));
    },
  };
};

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-10"
    style={{
      backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.10"/></svg>')`,
    }}
  />
);

const LeaveList = () => {
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employeeName: '',
    includePastEmployees: false,
  });
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id, { skip: !id });
  const employeeId = employee?.data.employee.id;

  const { data: leaveRequests, isLoading, error, refetch } = useGetAllLeaveRequestsOfOrganisationQuery(employeeId, {
    skip: !employeeId,
  });
  const { mutateAsync: updateLeaveRequestStatus, isLoading: isUpdating } = useUpdateLeaveRequestStatusMutation();

  // Handle approve action
  const handleApprove = async (id) => {
    try {
      await updateLeaveRequestStatus({ id, status: 'Approved' }).unwrap();
      toast.success('Leave request approved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg font-lato',
      });
      refetch();
    } catch (err) {
      toast.error('Failed to approve leave request.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg font-lato',
      });
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    try {
      await updateLeaveRequestStatus({ id, status: 'Rejected' }).unwrap();
      toast.success('Leave request rejected successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg font-lato',
      });
      refetch();
    } catch (err) {
      toast.error('Failed to reject leave request.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg font-lato',
      });
    }
  };

  // CSV download
  const handleDownloadCSV = () => {
    const headers = ['Date', 'Employee', 'Type', 'Days', 'Status'];
    const data = filteredData.map((request) => [
      new Date(request.startDate).toLocaleDateString(),
      `${request.employee.firstName} ${request.employee.lastName}`,
      request.type,
      Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      request.status,
    ]);
    const csvContent = [headers, ...data].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'leave_requests.csv');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const filteredData = leaveRequests?.data?.filter((request) => {
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

  // Glassmorphism style
  const glass =
    'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-100/30 dark:border-gray-800/30 shadow-lg rounded-2xl';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <NoiseBG />
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16 z-50" />
      <div className="max-w-7xl mx-auto">
        <div className={`${glass} p-6 sm:p-8`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-100 tracking-tight font-poppins"
            >
              Leave Requests
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-lato"
              aria-label="Download leave requests as CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                From Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                To Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Employee Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.employeeName}
                  onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                  placeholder="Search by name"
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100/30 dark:border-gray-800/30 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300 text-lg animate-pulse font-lato">
                Loading leave requests...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600 dark:text-red-400 font-lato">
                Error loading data: {error.message}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 font-lato">
                No Records Found
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
                  <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                    <tr>
                      <th className="w-4 p-4">
                        <input
                          type="checkbox"
                          className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                          aria-label="Select all leave requests"
                        />
                      </th>
                      {['Date', 'Employee', 'Type', 'Days', 'Status', 'Actions'].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider font-poppins"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900/95 divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredData.map((request) => {
                      const days =
                        Math.ceil(
                          (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)
                        ) + 1;
                      return (
                        <motion.tr
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                              aria-label={`Select leave request for ${request.employee.firstName} ${request.employee.lastName}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {new Date(request.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {`${request.employee.firstName} ${request.employee.lastName}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {request.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {days}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                request.status
                              )} font-lato`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                                aria-label="View leave request details"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                                aria-label="Edit leave request"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              {request.status === 'Pending' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleApprove(request.id)}
                                    disabled={isUpdating}
                                    className="p-1 text-green-600 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                    aria-label="Approve leave request"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleReject(request.id)}
                                    disabled={isUpdating}
                                    className="p-1 text-red-600 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                                    aria-label="Reject leave request"
                                  >
                                    <X className="w-4 h-4" />
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((request) => {
                    const days =
                      Math.ceil(
                        (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)
                      ) + 1;
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white dark:bg-gray-900/95 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                              aria-label={`Select leave request for ${request.employee.firstName} ${request.employee.lastName}`}
                            />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                request.status
                              )} font-lato`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                              aria-label="View leave request details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                              aria-label="Edit leave request"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            {request.status === 'Pending' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => handleApprove(request.id)}
                                  disabled={isUpdating}
                                  className="p-1 text-green-600 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                  aria-label="Approve leave request"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => handleReject(request.id)}
                                  disabled={isUpdating}
                                  className="p-1 text-red-600 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                                  aria-label="Reject leave request"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-900 dark:text-gray-200 font-lato">
                          <p>
                            <span className="font-medium">Date:</span>{' '}
                            {new Date(request.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Employee:</span>{' '}
                            {`${request.employee.firstName} ${request.employee.lastName}`}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span> {request.type}
                          </p>
                          <p>
                            <span className="font-medium">Days:</span> {days}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`${glass} p-6 max-w-md w-full`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-poppins">
                  Quick Help Guide
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close help modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 font-lato">
                <p className="text-sm">Here's how to manage leave requests:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use filters to narrow down leave requests by date, status, or employee</li>
                  <li>View or edit requests using the action icons</li>
                  <li>Approve or reject pending requests directly from the table</li>
                  <li>Export the list as a CSV file for reporting</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all duration-300"
        aria-label="Open help guide"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

export default LeaveList;