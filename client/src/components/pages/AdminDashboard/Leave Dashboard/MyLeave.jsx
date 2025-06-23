import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown, Search, RefreshCw, Eye, Check, X, Download, Calendar, HelpCircle  } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetAllLeaveRequestsQuery,
  useUpdateLeaveRequestMutation,
} from '../../../../slices/leaveApiSlice';
import { useGetLeaveBalanceQuery } from '../../../../slices/leaveBalancesApiSlice';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';

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

const MyLeaveList = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  // Fetch leave requests
  const { data: leaveRequestsData, isLoading, error: fetchError, refetch } = useGetAllLeaveRequestsQuery({
    employeeId,
  }, { skip: !employeeId });
  const leaveRequests = leaveRequestsData?.data?.leaveRequests || [];

  // Fetch leave balance
  const { data: leaveBalanceData } = useGetLeaveBalanceQuery(employeeId, { skip: !employeeId });
  const leaveBalance = leaveBalanceData?.data?.leaveBalance;

  // Mutation for updating leave status
  const [updateLeaveRequest, { isLoading: isUpdating }] = useUpdateLeaveRequestMutation();

  const statusOptions = [
    { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { id: 'pending', label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { id: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  ];

  const leaveTypes = [
    { value: 'Annual Leave', label: 'Annual Leave', balanceKey: 'annualLeave' },
    { value: 'Sick Leave', label: 'Sick Leave', balanceKey: 'sickLeave' },
    { value: 'Compassionate Leave', label: 'Compassionate Leave', balanceKey: 'compassionateLeave' },
  ];

  const handleAction = async (id, action) => {
    try {
      const updatedRequest = {
        id,
        body: {
          status: action.toLowerCase(),
          approvedBy: userInfo?.id || 1,
        },
      };
      await updateLeaveRequest(updatedRequest).unwrap();
      toast.success(`Leave request ${action} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg font-lato',
      });
      refetch();
    } catch (error) {
      toast.error(`Failed to ${action} leave request: ${error?.data?.message || error.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg font-lato',
      });
    }
  };

  const filteredLeaves = leaveRequests.filter((leave) => {
    const startDate = new Date(leave.startDate);
    const matchesDate = (!fromDate || startDate >= fromDate) && (!toDate || startDate <= toDate);
    const matchesStatus = !leaveStatus || leave.status === leaveStatus;
    const matchesType = !leaveType || leave.type === leaveType;
    return matchesDate && matchesStatus && matchesType;
  });

  const getLeaveBalance = (type) => {
    if (!leaveBalance) return 0;
    const leaveTypeObj = leaveTypes.find((t) => t.value === type);
    return leaveBalance[leaveTypeObj?.balanceKey] || 0;
  };

  // CSV download
  const handleDownloadCSV = () => {
    const headers = ['Date', 'Employee', 'Leave Type', 'Balance (Days)', 'Days', 'Status', 'Comments'];
    const data = filteredLeaves.map((leave) => [
      new Date(leave.startDate).toLocaleDateString(),
      `${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`,
      leave.type,
      getLeaveBalance(leave.type),
      Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      statusOptions.find((s) => s.id === leave.status)?.label || leave.status,
      leave.comments || '-',
    ]);
    const csvContent = [headers, ...data].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'my_leave_list.csv');
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-100 tracking-tight font-poppins"
          >
            My Leave List
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-lato"
            aria-label="Download leave list as CSV"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glass} p-6 mb-6`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                From Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
                  placeholderText="Select start date"
                  aria-label="Select start date"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                To Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato"
                  placeholderText="Select end date"
                  minDate={fromDate}
                  aria-label="Select end date"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>

            {/* Leave Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato appearance-none"
                  aria-label="Select leave status"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato appearance-none"
                  aria-label="Select leave type"
                >
                  <option value="">All Types</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-indigo-600 font-lato">* Required</span>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm flex items-center font-lato"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setLeaveStatus('');
                  setLeaveType('');
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
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm flex items-center font-lato"
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
          <div className="text-center text-red-500 dark:text-red-400 mb-4 font-lato">
            Error fetching leave requests: {fetchError?.data?.message || fetchError.message}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm mb-4 text-indigo-700 dark:text-indigo-300 font-lato">
          <span className="font-medium">{filteredLeaves.length}</span> Records Found
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glass} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300 text-lg animate-pulse font-lato">
                Loading leave requests...
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 font-lato">
                No Records Found
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <table className="w-full hidden md:table">
                  <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                    <tr>
                      <th className="w-10 p-4">
                        <input
                          type="checkbox"
                          className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                          aria-label="Select all leave requests"
                        />
                      </th>
                      {['Date', 'Employee', 'Leave Type', 'Balance (Days)', 'Days', 'Status', 'Comments', 'Actions'].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-sm font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider font-poppins"
                          >
                            <div className="flex items-center">
                              {header}
                              <ArrowUpDown className="w-4 h-4 ml-1 cursor-pointer hover:text-indigo-500" />
                            </div>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredLeaves.map((leave) => {
                      const days =
                        Math.ceil(
                          (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)
                        ) + 1;
                      return (
                        <motion.tr
                          key={leave.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
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
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {new Date(leave.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {`${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">{leave.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {getLeaveBalance(leave.type)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">{days}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusOptions.find((s) => s.id === leave.status)?.color
                              } font-lato`}
                            >
                              {statusOptions.find((s) => s.id === leave.status)?.label || leave.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {leave.comments || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                                aria-label="View leave request details"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              {leave.status === 'pending' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleAction(leave.id, 'approved')}
                                    disabled={isUpdating}
                                    className="p-1 text-green-600 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                    aria-label="Approve leave request"
                                  >
                                    <Check className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleAction(leave.id, 'rejected')}
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
                  {filteredLeaves.map((leave) => {
                    const days =
                      Math.ceil(
                        (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)
                      ) + 1;
                    return (
                      <motion.div
                        key={leave.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white dark:bg-gray-900/95 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                              aria-label={`Select leave request for ${leave.employee?.firstName || 'Unknown'} ${
                                leave.employee?.lastName || ''
                              }`}
                            />
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusOptions.find((s) => s.id === leave.status)?.color
                              } font-lato`}
                            >
                              {statusOptions.find((s) => s.id === leave.status)?.label || leave.status}
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
                            {leave.status === 'pending' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => handleAction(leave.id, 'approved')}
                                  disabled={isUpdating}
                                  className="p-1 text-green-600 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                  aria-label="Approve leave request"
                                >
                                  <Check className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => handleAction(leave.id, 'rejected')}
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
                            {new Date(leave.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Employee:</span>{' '}
                            {`${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`}
                          </p>
                          <p>
                            <span className="font-medium">Type:</span> {leave.type}
                          </p>
                          <p>
                            <span className="font-medium">Balance:</span> {getLeaveBalance(leave.type)} days
                          </p>
                          <p>
                            <span className="font-medium">Days:</span> {days}
                          </p>
                          <p>
                            <span className="font-medium">Comments:</span> {leave.comments || '-'}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>
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
                <p className="text-sm">Here's how to manage your leave requests:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use filters to narrow down leave requests by date, status, or type</li>
                  <li>View details of a request using the eye icon</li>
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

export default MyLeaveList;