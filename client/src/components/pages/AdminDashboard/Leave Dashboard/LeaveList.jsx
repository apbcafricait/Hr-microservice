import React, { useState } from 'react';
import { ChevronDown, Calendar, HelpCircle, X, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllLeaveRequestsOfOrganisationQuery, useDeleteLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../../slices/employeeSlice';

const LeaveList = () => {
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });
    const { userInfo } = useSelector((state) => state.auth);
    const id = userInfo?.id;
    const { data: employee } = useGetEmployeeQuery(id);
   
    const employeeId = employee?.data.employee.id;
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    employeeName: '',
    includePastEmployees: false,
  });

  // Fetch leave requests from backend
  const { data: leaveRequests, isLoading, error, refetch } = useGetAllLeaveRequestsOfOrganisationQuery(employeeId);
  console.log(leaveRequests, "leaveRequests");
  const [deleteLeaveRequest, { isLoading: isDeleting }] = useDeleteLeaveRequestMutation();

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
console.log(filteredData, "filteredData");
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
                            {/* <motion.button
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
                            </motion.button> */}
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