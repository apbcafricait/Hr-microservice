import React, { useState, useCallback } from 'react';
import { ChevronDown, Calendar, RefreshCw, Search, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetAllLeaveRequestsQuery, useUpdateLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
    style={{
      backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.10"/></svg>')`,
    }}
  />
);

const MyLeaveList = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  // Fetch leave requests
  const { data: leaveRequestsData, isLoading, error: fetchError, refetch } = useGetAllLeaveRequestsQuery(
    { employeeId },
    { skip: !employeeId }
  );
  const leaveRequests = leaveRequestsData?.data?.leaveRequests || [];

  // Mutation for updating leave status
  const [updateLeaveRequest, { isLoading: isUpdating }] = useUpdateLeaveRequestMutation();

  const statusOptions = [
    { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' },
    { id: 'pending', label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
    { id: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
  ];

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      try {
        const updatedRequest = {
          id,
          body: {
            status: newStatus,
            approvedBy: userInfo?.id || 1,
          },
        };
        await updateLeaveRequest(updatedRequest).unwrap();
        toast.success(`Leave request updated to ${newStatus} successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          className: 'bg-green-600 text-white rounded-xl shadow-lg p-4 font-inter text-sm',
        });
        refetch();
      } catch (error) {
        toast.error(`Failed to update leave request: ${error?.data?.message || error.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000,
          className: 'bg-red-600 text-white rounded-xl shadow-lg p-4 font-inter text-sm',
        });
      }
    },
    [updateLeaveRequest, refetch, userInfo]
  );

  const filteredLeaves = useCallback(() => {
    return leaveRequests.filter((leave) => {
      const startDate = new Date(leave.startDate);
      const matchesDate = (!fromDate || startDate >= fromDate) && (!toDate || startDate <= toDate);
      const matchesStatus = !leaveStatus || leave.status === leaveStatus;
      return matchesDate && matchesStatus;
    });
  }, [leaveRequests, fromDate, toDate, leaveStatus]);

  // CSV download
  const handleDownloadCSV = useCallback(() => {
    const headers = ['Date', 'Employee', 'Type', 'Status'];
    const data = filteredLeaves().map((leave) => [
      new Date(leave.startDate).toLocaleDateString(),
      `${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`,
      leave.type,
      statusOptions.find((s) => s.id === leave.status)?.label || leave.status,
    ]);
    const csvContent = [headers, ...data].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'my_leave_list.csv');
  }, [filteredLeaves, statusOptions]);

  // Glassmorphism style
  const glassStyle = `backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-100/20 dark:border-gray-800/20 shadow-2xl rounded-2xl`;

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 font-inter">
      <NoiseBG />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${glassStyle} p-6 sm:p-8`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              My Leave List
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              aria-label="Download leave list as CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                From Date
              </label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm pr-10"
                placeholderText="Select start date"
                aria-label="Select start date"
              />
              <Calendar className="absolute right-3 top-[2.6rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                To Date
              </label>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm pr-10"
                placeholderText="Select end date"
                minDate={fromDate}
                aria-label="Select end date"
              />
              <Calendar className="absolute right-3 top-[2.6rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Status
              </label>
              <select
                value={leaveStatus}
                onChange={(e) => setLeaveStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm appearance-none pr-10"
                aria-label="Select leave status"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-[2.6rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">* Optional filters</span>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-sm flex items-center"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setLeaveStatus('');
                  refetch();
                }}
                aria-label="Reset filters"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm flex items-center"
                onClick={() => refetch()}
                aria-label="Search leave requests"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Fetch Error */}
        {fetchError && (
          <div className="text-center text-red-500 dark:text-red-400 my-4 text-sm">
            Error fetching leave requests: {fetchError?.data?.message || fetchError.message}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm my-4 text-gray-700 dark:text-gray-300">
          <span className="font-medium">{filteredLeaves().length}</span> Records Found
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassStyle} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300 text-sm animate-pulse">
                Loading leave requests...
              </div>
            ) : filteredLeaves().length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 text-sm rounded-xl">
                No Records Found
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <table className="w-full hidden md:table">
                  <thead className="bg-indigo-50/50 dark:bg-indigo-900/20">
                    <tr>
                      <th className="w-10 p-4">
                        <input
                          type="checkbox"
                          className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                          aria-label="Select all leave requests"
                        />
                      </th>
                      {['Date', 'Employee', 'Type', 'Status', 'Actions'].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-tight"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {filteredLeaves().map((leave) => (
                      <motion.tr
                        key={leave.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                            aria-label={`Select leave request for ${leave.employee?.firstName || 'Unknown'} ${
                              leave.employee?.lastName || ''
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                          {`${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{leave.type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find((s) => s.id === leave.status)?.color
                            }`}
                          >
                            {statusOptions.find((s) => s.id === leave.status)?.label || leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="relative">
                            <select
                              value={leave.status}
                              onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8 min-w-[120px]"
                              aria-label="Change leave status"
                            >
                              {statusOptions.map((status) => (
                                <option key={status.id} value={status.id}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {filteredLeaves().map((leave) => (
                    <motion.div
                      key={leave.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-white/50 dark:bg-gray-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                            aria-label={`Select leave request for ${leave.employee?.firstName || 'Unknown'} ${
                              leave.employee?.lastName || ''
                            }`}
                          />
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusOptions.find((s) => s.id === leave.status)?.color
                            }`}
                          >
                            {statusOptions.find((s) => s.id === leave.status)?.label || leave.status}
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            value={leave.status}
                            onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                            disabled={isUpdating}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8"
                            aria-label="Change leave status"
                          >
                            {statusOptions.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-900 dark:text-gray-200">
                        <p>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(leave.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Employee:</span>{' '}
                          {`${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`}
                        </p>
                        <p>
                          <span className="font-medium">Type:</span> {leave.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyLeaveList;