import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown, Search, RefreshCw, Eye, Check, X, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetAllLeaveRequestsQuery,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
} from '../../../../slices/leaveApiSlice';
import { useGetLeaveBalanceQuery } from '../../../../slices/leaveBalancesApiSlice';
import { useSelector } from 'react-redux';

const MyLeaveList = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  // Fetch leave requests
  const { data: leaveRequestsData, isLoading, error: fetchError, refetch } = useGetAllLeaveRequestsQuery();
  const leaveRequests = leaveRequestsData?.data?.leaveRequests || [];

  // Fetch leave balance
  const { data: leaveBalanceData } = useGetLeaveBalanceQuery(employeeId, { skip: !employeeId });
  const leaveBalance = leaveBalanceData?.data?.leaveBalance;

  // Mutations for actions
  const [updateLeaveRequest, { isLoading: isUpdating }] = useUpdateLeaveRequestMutation();
  const [deleteLeaveRequest, { isLoading: isDeleting }] = useDeleteLeaveRequestMutation();

  const statusOptions = [
    { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { id: 'pending', label: 'Pending Approval', color: 'bg-yellow-500' },
    { id: 'approved', label: 'Approved', color: 'bg-green-500' },
  ];

  const leaveTypes = [
    { value: 'Annual Leave', label: 'Annual Leave', balanceKey: 'annualLeave' },
    { value: 'Sick Leave', label: 'Sick Leave', balanceKey: 'sickLeave' },
    { value: 'Compassionate Leave', label: 'Compassionate Leave', balanceKey: 'compassionateLeave' },
  ];

  const handleAction = async (id, action) => {
    try {
      if (action === 'delete') {
        const result = await deleteLeaveRequest(id).unwrap();
        console.log(`Leave request ${id} deleted successfully:`, result);
        toast.success('Leave request deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: 'bg-green-500 text-white',
        });
      } else {
        const updatedRequest = {
          id,
          body: { 
            status: action.toLowerCase(), // Ensure lowercase matches backend
            approvedBy: userInfo?.id || 1, // Fallback to 1 if userInfo.id is undefined
          },
        };
        console.log('Sending update request:', updatedRequest); // Debug payload
        const result = await updateLeaveRequest(updatedRequest).unwrap();
        console.log(`Leave request ${id} ${action} successfully:`, result);
        toast.success(`Leave request ${action} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: 'bg-green-500 text-white',
        });
      }
      refetch();
    } catch (error) {
      console.error(`Failed to ${action} leave request:`, error);
      toast.error(`Failed to ${action} leave request: ${error?.data?.message || error.message || 'Unknown error'}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-red-500 text-white',
      });
    }
  };

  const filteredLeaves = leaveRequests.filter((leave) => {
    const startDate = new Date(leave.startDate);
    const matchesDate =
      (!fromDate || startDate >= fromDate) && (!toDate || startDate <= toDate);
    const matchesStatus = !leaveStatus || leave.status === leaveStatus;
    const matchesType = !leaveType || leave.type === leaveType;
    return matchesDate && matchesStatus && matchesType;
  });

  const getLeaveBalance = (type) => {
    if (!leaveBalance) return 0;
    const leaveTypeObj = leaveTypes.find((t) => t.value === type);
    return leaveBalance[leaveTypeObj?.balanceKey] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16 z-50"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 tracking-tight">
            My Leave List
          </h1>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-indigo-100"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                From Date
              </label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full p-3 rounded-lg border-2 border-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
                placeholderText="Select start date"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                To Date
              </label>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="MM/dd/yyyy"
                className="w-full p-3 rounded-lg border-2 border-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm"
                placeholderText="Select end date"
                minDate={fromDate}
              />
            </div>

            {/* Leave Status */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm appearance-none"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
              </div>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm appearance-none"
                >
                  <option value="">All Types</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-indigo-600">* Required</span>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-sm flex items-center"
                onClick={() => {
                  setFromDate(null);
                  setToDate(null);
                  setLeaveStatus('');
                  setLeaveType('');
                  refetch();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md flex items-center"
                onClick={() => refetch()}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Fetch Error */}
        {fetchError && (
          <div className="text-center text-red-500 mb-4">
            Error fetching leave requests: {fetchError?.data?.message || fetchError.message}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm mb-4 text-indigo-700">
          <span className="font-semibold">{filteredLeaves.length}</span> Records Found
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
        >
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 text-lg animate-pulse">
                Loading leave requests...
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50">
                No Records Found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="w-10 p-4">
                      <input type="checkbox" className="rounded border-indigo-300" />
                    </th>
                    {['Date', 'Employee', 'Leave Type', 'Balance (Days)', 'Days', 'Status', 'Comments', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {header}
                          <ArrowUpDown className="w-4 h-4 ml-1 cursor-pointer hover:text-indigo-500" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {filteredLeaves.map((leave) => {
                    const days = Math.ceil(
                      (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)
                    ) + 1;
                    return (
                      <motion.tr
                        key={leave.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-indigo-300" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {`${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || ''}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{leave.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {getLeaveBalance(leave.type)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{days}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              statusOptions.find((s) => s.id === leave.status)?.color
                            } bg-opacity-20`}
                          >
                            {statusOptions.find((s) => s.id === leave.status)?.label || leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{leave.comments || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleAction(leave.id, 'approved')}
                              disabled={isUpdating || leave.status !== 'pending'}
                              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleAction(leave.id, 'rejected')}
                              disabled={isUpdating || leave.status !== 'pending'}
                              className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleAction(leave.id, 'delete')}
                              disabled={isDeleting}
                              className="p-1 text-gray-600 hover:text-red-500 disabled:opacity-50"
                              title="Delete"
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
        </motion.div>
      </div>
    </div>
  );
};

export default MyLeaveList;