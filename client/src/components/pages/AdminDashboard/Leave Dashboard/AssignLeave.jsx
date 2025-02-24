import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, X, AlertCircle } from 'lucide-react';
import { Popover } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllEmployeesQuery } from '../../../../slices/employeeSlice'
import { useCreateLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useGetLeaveBalanceQuery } from '../../../../slices/leaveBalancesApiSlice';

const AssignLeave = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery();
  const employees = employeesData?.data?.employees || [];

  // Fetch leave balance for selected employee
  const { data: leaveBalanceData, refetch: refetchBalance } = useGetLeaveBalanceQuery(
    selectedEmployee?.id,
    { skip: !selectedEmployee } // Only fetch when an employee is selected
  );
  const leaveBalance = leaveBalanceData?.data?.leaveBalance;

  // Create leave request mutation
  const [createLeaveRequest, { isLoading: isSubmitting, error: submitError }] =
    useCreateLeaveRequestMutation();

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', balanceKey: 'annualLeave' },
    { value: 'sick', label: 'Sick Leave', balanceKey: 'sickLeave' },
    { value: 'compassionate', label: 'Compassionate Leave', balanceKey: 'compassionateLeave' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const duration = Math.ceil(
        (new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

      const leaveRequest = {
        employeeId: formData.employeeId,
        type: formData.leaveType,
        startDate: formData.fromDate,
        endDate: formData.toDate,
        comments: formData.comments,
        duration,
      };

      const result = await createLeaveRequest(leaveRequest).unwrap();
      console.log('Leave assigned successfully:', result);
      toast.success('Leave assigned successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-green-500 text-white',
      });
      resetForm();
      refetchBalance();
    } catch (error) {
      console.error('Failed to assign leave:', error);
      toast.error('Failed to assign leave. Please try again.', {
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

  const resetForm = () => {
    setFormData({
      employeeId: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      comments: '',
    });
    setSelectedEmployee(null);
  };

  const getLeaveBalance = () => {
    if (!leaveBalance || !formData.leaveType) return "0";
    const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);
    return leaveBalance[selectedType?.balanceKey] || "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8"
    >
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

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 tracking-tight">
              Assign Leave
            </h1>
            <motion.button
              whileHover={{ rotate: 90 }}
              className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
              onClick={resetForm}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-indigo-900">
                Employee Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.employeeId}
                  onChange={(e) => {
                    const employee = employees.find((emp) => emp.id === Number(e.target.value));
                    setFormData({ ...formData, employeeId: e.target.value });
                    setSelectedEmployee(employee);
                  }}
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm appearance-none"
                >
                  <option value="">Select an employee</option>
                  {employeesLoading ? (
                    <option>Loading employees...</option>
                  ) : (
                    employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
              </div>
            </div>

            {/* Leave Type and Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-900">
                  Leave Type<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white shadow-sm appearance-none"
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-900">
                  Leave Balance
                </label>
                <div className="px-4 py-3 border-2 border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium shadow-inner flex items-center justify-center">
                  {selectedEmployee ? `${getLeaveBalance()} Day(s)` : "Select an employee"}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Popover className="relative">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  From Date<span className="text-red-500 ml-1">*</span>
                </label>
                <Popover.Button className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-left flex justify-between items-center bg-white shadow-sm">
                  {formData.fromDate || "Select date"}
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </Popover.Panel>
              </Popover>

              <Popover className="relative">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  To Date<span className="text-red-500 ml-1">*</span>
                </label>
                <Popover.Button className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-left flex justify-between items-center bg-white shadow-sm">
                  {formData.toDate || "Select date"}
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    min={formData.fromDate}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </Popover.Panel>
              </Popover>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-indigo-900">
                Comments
              </label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm resize-none"
                placeholder="Add any additional notes here..."
              />
            </div>

            {/* Required Text and Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
              <p className="text-sm text-indigo-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required fields are marked with *
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting || !formData.employeeId || !formData.leaveType || !formData.fromDate || !formData.toDate}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Assigning...
                  </span>
                ) : (
                  "Assign Leave"
                )}
              </motion.button>
            </div>

            {submitError && (
              <div className="mt-4 text-red-500 text-sm">
                Error: {submitError?.data?.message || "Failed to assign leave."}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AssignLeave;