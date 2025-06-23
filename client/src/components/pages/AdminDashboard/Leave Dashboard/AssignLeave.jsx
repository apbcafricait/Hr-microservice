import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, X, AlertCircle, HelpCircle } from 'lucide-react';
import { Popover } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllEmployeesQuery } from '../../../../slices/employeeSlice';
import { useCreateLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useGetLeaveBalanceQuery } from '../../../../slices/leaveBalancesApiSlice';

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

const AssignLeave = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Fetch employees
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery();
  const employees = employeesData?.data?.employees || [];

  // Fetch leave balance for selected employee
  const { data: leaveBalanceData, refetch: refetchBalance } = useGetLeaveBalanceQuery(
    selectedEmployee?.id,
    { skip: !selectedEmployee }
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

  // Validate form fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'employeeId':
        if (!value) newErrors.employeeId = 'Employee selection is required';
        else delete newErrors.employeeId;
        break;
      case 'leaveType':
        if (!value) newErrors.leaveType = 'Leave type is required';
        else delete newErrors.leaveType;
        break;
      case 'fromDate':
        if (!value) newErrors.fromDate = 'Start date is required';
        else delete newErrors.fromDate;
        break;
      case 'toDate':
        if (!value) newErrors.toDate = 'End date is required';
        else if (new Date(value) < new Date(formData.fromDate))
          newErrors.toDate = 'End date cannot be before start date';
        else delete newErrors.toDate;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
    if (field === 'employeeId') {
      const employee = employees.find((emp) => emp.id === Number(value));
      setSelectedEmployee(employee);
    }
  };

  // Auto-calculate end date based on leave balance
  useEffect(() => {
    if (formData.fromDate && formData.leaveType && leaveBalance) {
      const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);
      const balance = leaveBalance[selectedType?.balanceKey] || 0;
      if (balance > 0) {
        const newToDate = new Date(formData.fromDate);
        newToDate.setDate(newToDate.getDate() + balance - 1);
        setFormData((prev) => ({ ...prev, toDate: newToDate.toISOString().split('T')[0] }));
        validateField('toDate', newToDate.toISOString().split('T')[0]);
      }
    }
  }, [formData.fromDate, formData.leaveType, leaveBalance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = ['employeeId', 'leaveType', 'fromDate', 'toDate'].every((field) =>
      validateField(field, formData[field])
    );

    if (!isValid) {
      toast.error('Please correct the errors in the form.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg font-lato',
      });
      return;
    }

    try {
      const duration =
        Math.ceil((new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24)) + 1;

      const leaveRequest = {
        employeeId: formData.employeeId,
        type: formData.leaveType,
        startDate: formData.fromDate,
        endDate: formData.toDate,
        comments: formData.comments,
        duration,
      };

      await createLeaveRequest(leaveRequest).unwrap();
      toast.success('Leave assigned successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg font-lato',
      });
      resetForm();
      refetchBalance();
    } catch (error) {
      toast.error(`Failed to assign leave: ${error?.data?.message || 'Please try again.'}`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg font-lato',
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
    setErrors({});
  };

  const getLeaveBalance = () => {
    if (!leaveBalance || !formData.leaveType) return '0';
    const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);
    return leaveBalance[selectedType?.balanceKey] || '0';
  };

  // Calculate duration
  const calculateDuration = () => {
    if (formData.fromDate && formData.toDate) {
      const diffTime = Math.abs(new Date(formData.toDate) - new Date(formData.fromDate));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
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

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${glass} p-6 sm:p-8`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-100 tracking-tight font-poppins">
              Assign Leave
            </h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={resetForm}
              aria-label="Clear form"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.employeeId ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato appearance-none`}
                  aria-invalid={!!errors.employeeId}
                  aria-describedby={errors.employeeId ? 'employeeId-error' : ''}
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                {errors.employeeId && (
                  <p id="employeeId-error" className="text-xs text-red-500 mt-1 font-lato">
                    {errors.employeeId}
                  </p>
                )}
              </div>
            </div>

            {/* Leave Type and Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => handleChange('leaveType', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.leaveType ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato appearance-none`}
                    aria-invalid={!!errors.leaveType}
                    aria-describedby={errors.leaveType ? 'leaveType-error' : ''}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  {errors.leaveType && (
                    <p id="leaveType-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.leaveType}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                  Leave Balance
                </label>
                <div className="px-4 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm flex items-center justify-center font-lato">
                  {selectedEmployee ? `${getLeaveBalance()} Day(s)` : 'Select an employee'}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => handleChange('fromDate', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.fromDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato`}
                    aria-invalid={!!errors.fromDate}
                    aria-describedby={errors.fromDate ? 'fromDate-error' : ''}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  {errors.fromDate && (
                    <p id="fromDate-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.fromDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => handleChange('toDate', e.target.value)}
                    min={formData.fromDate}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.toDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-lato`}
                    aria-invalid={!!errors.toDate}
                    aria-describedby={errors.toDate ? 'toDate-error' : ''}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  {errors.toDate && (
                    <p id="toDate-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.toDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Duration Display */}
            {formData.fromDate && formData.toDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm font-lato"
              >
                Duration: {calculateDuration()} day(s)
              </motion.div>
            )}

            {/* Comments */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 font-lato">
                Comments
              </label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none font-lato"
                placeholder="Add any additional notes here..."
                aria-label="Additional comments"
              />
            </div>

            {/* Required Text and Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
              <p className="text-sm text-indigo-600 dark:text-indigo-300 flex items-center font-lato">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required fields are marked with *
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm font-lato"
                  onClick={resetForm}
                  aria-label="Clear form"
                >
                  Clear Form
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting || !formData.employeeId || !formData.leaveType || !formData.fromDate || !formData.toDate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-lato"
                  aria-label="Assign leave"
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
                    'Assign Leave'
                  )}
                </motion.button>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 text-red-500 dark:text-red-400 text-sm font-lato">
                Error: {submitError?.data?.message || 'Failed to assign leave.'}
              </div>
            )}
          </form>
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
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close help modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 font-lato">
                <p className="text-sm">Here's how to assign a leave:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Select an employee from the dropdown</li>
                  <li>Choose a leave type to view the available balance</li>
                  <li>Pick start and end dates; end date auto-fills based on balance</li>
                  <li>Add optional comments for details</li>
                  <li>Click "Assign Leave" to submit the request</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all duration-300"
        aria-label="Open help guide"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

export default AssignLeave;