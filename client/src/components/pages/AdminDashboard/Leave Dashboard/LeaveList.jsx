import React, { useState, useCallback } from 'react';
import { ChevronDown, Calendar, X, Search, Download, Filter, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
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
      return new Promise((resolve) => setTimeout(() => resolve({ id, status }), 500));
    },
  };
};

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
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
  });

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id, { skip: !id });
  const employeeId = employee?.data?.employee?.id;

  const { data: leaveRequests, isLoading, error, refetch } = useGetAllLeaveRequestsOfOrganisationQuery(employeeId, {
    skip: !employeeId,
  });
  const { mutateAsync: updateLeaveRequestStatus, isLoading: isUpdating } = useUpdateLeaveRequestStatusMutation();

  // Compute filtered data
  const filteredData = useCallback(() => {
    return (
      leaveRequests?.data?.filter((request) => {
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
      }) || []
    );
  }, [leaveRequests, dateRange, filters]);

  const handleApprove = async (id) => {
    try {
      await updateLeaveRequestStatus({ id, status: 'approved' });
      toast.success('Leave request approved successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to approve leave request');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateLeaveRequestStatus({ id, status: 'rejected' });
      toast.success('Leave request rejected successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to reject leave request');
    }
  };

  // CSV download
  const handleDownloadCSV = useCallback(() => {
    const data = filteredData();
    const headers = ['Date', 'Employee', 'Type', 'Days', 'Status'];
    const csvData = data.map((request) => [
      new Date(request.startDate).toLocaleDateString(),
      `${request.employee.firstName} ${request.employee.lastName}`,
      request.type,
      Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1,
      request.status,
    ]);
    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'leave_requests.csv');
  }, [filteredData]);

  const getStatusColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 font-lato">
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
        theme="colored"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 dark:text-white tracking-tight">
                  Leave Requests
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-lato">
                  Manage and review all leave applications
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadCSV}
              className="glass-button flex items-center gap-2"
              aria-label="Download leave requests as CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="relative">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="glass-input pr-10"
                aria-label="Filter by start date"
              />
              <Calendar className="absolute right-4 top-[2.8rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="glass-input pr-10"
                aria-label="Filter by end date"
              />
              <Calendar className="absolute right-4 top-[2.8rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="glass-input appearance-none pr-10"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-4 top-[2.8rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
            <div className="relative">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Employee Name
              </label>
              <input
                type="text"
                value={filters.employeeName}
                onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                placeholder="Search by name"
                className="glass-input pr-10"
                aria-label="Search by employee name"
              />
              <Search className="absolute right-4 top-[2.8rem] -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                  {filteredData().length} Leave Request{filteredData().length !== 1 ? 's' : ''} Found
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-lato">
                <Clock className="w-4 h-4" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100/20 dark:border-gray-800/20 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300 text-sm animate-pulse font-lato">
                Loading leave requests...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 dark:text-red-400 text-sm font-lato">
                Error loading data: {error.message}
              </div>
            ) : filteredData().length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 text-sm rounded-xl font-lato">
                No Records Found
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50 hidden md:table">
                  <thead className="bg-indigo-50/50 dark:bg-indigo-900/20">
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
                          className="px-4 py-3 text-left text-xs font-poppins font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-tight"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 dark:bg-gray-900/50 divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {filteredData().map((request) => {
                      const days =
                        Math.ceil(
                          (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)
                        ) + 1;
                      return (
                        <motion.tr
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                              aria-label={`Select leave request for ${request.employee.firstName} ${request.employee.lastName}`}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {new Date(request.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {`${request.employee.firstName} ${request.employee.lastName}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {request.type}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 font-lato">
                            {days}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {request.status === 'Pending' && (
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(request.id)}
                                  disabled={isUpdating}
                                  className="px-3 py-1.5 text-xs font-poppins font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Approve leave request"
                                >
                                  Approve
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleReject(request.id)}
                                  disabled={isUpdating}
                                  className="px-3 py-1.5 text-xs font-poppins font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Reject leave request"
                                >
                                  Reject
                                </motion.button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {filteredData().map((request) => {
                    const days =
                      Math.ceil(
                        (new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)
                      ) + 1;
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-white/50 dark:bg-gray-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="rounded border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500"
                              aria-label={`Select leave request for ${request.employee.firstName} ${request.employee.lastName}`}
                            />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </div>
                          {request.status === 'Pending' && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApprove(request.id)}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-poppins font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Approve leave request"
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReject(request.id)}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-poppins font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Reject leave request"
                              >
                                Reject
                              </motion.button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-900 dark:text-gray-200 font-lato">
                          <p>
                            <span className="font-poppins font-semibold">Date:</span>{' '}
                            {new Date(request.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-poppins font-semibold">Employee:</span>{' '}
                            {`${request.employee.firstName} ${request.employee.lastName}`}
                          </p>
                          <p>
                            <span className="font-poppins font-semibold">Type:</span> {request.type}
                          </p>
                          <p>
                            <span className="font-poppins font-semibold">Days:</span> {days}
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
    </div>
  );
};

export default LeaveList;