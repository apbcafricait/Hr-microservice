import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, X, User, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllEmployeesQuery } from '../../../../slices/employeeSlice';
import { useCreateLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useGetLeaveBalanceQuery } from '../../../../slices/leaveBalancesApiSlice';

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")`,
    }}
  />
);

const AssignLeave = () => {
  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});

  // Redux Data Fetching
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery();
  const employees = employeesData?.data?.employees || [];
  const { data: leaveBalanceData, refetch: refetchBalance } = useGetLeaveBalanceQuery(
    selectedEmployee?.id,
    { skip: !selectedEmployee }
  );
  const leaveBalance = leaveBalanceData?.data?.leaveBalance;
  const [createLeaveRequest, { isLoading: isSubmitting, error: submitError }] =
    useCreateLeaveRequestMutation();

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', balanceKey: 'annualLeave', icon: '🏖️' },
    { value: 'sick', label: 'Sick Leave', balanceKey: 'sickLeave', icon: '🏥' },
    { value: 'compassionate', label: 'Compassionate Leave', balanceKey: 'compassionateLeave', icon: '💝' },
  ];

  // Form Validation
  const validateField = useCallback(
    (name, value) => {
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
          else if (formData.fromDate && new Date(value) < new Date(formData.fromDate))
            newErrors.toDate = 'End date cannot be before start date';
          else delete newErrors.toDate;
          break;
        default:
          break;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [errors, formData.fromDate]
  );

  // Event Handlers
  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);
      if (field === 'employeeId') {
        const employee = employees.find((emp) => emp.id === Number(value));
        setSelectedEmployee(employee);
      }
    },
    [employees, validateField]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const requiredFields = ['employeeId', 'leaveType', 'fromDate', 'toDate'];
      const isValid = requiredFields.every((field) => validateField(field, formData[field]));

      if (!isValid) {
        toast.error('Please correct the errors in the form.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        return;
      }

      try {
        const duration =
          Math.ceil((new Date(formData.toDate) - new Date(formData.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
        const leaveRequest = {
          employeeId: Number(formData.employeeId),
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
          theme: 'colored',
        });
        resetForm();
        refetchBalance();
      } catch (error) {
        toast.error(`Failed to assign leave: ${error?.data?.message || 'Please try again.'}`, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    },
    [formData, createLeaveRequest, refetchBalance]
  );

  const resetForm = useCallback(() => {
    setFormData({
      employeeId: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      comments: '',
    });
    setSelectedEmployee(null);
    setErrors({});
  }, []);

  // Auto-calculate end date based on leave balance
  useEffect(() => {
    if (formData.fromDate && formData.leaveType && leaveBalance) {
      const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);
      const balance = leaveBalance[selectedType?.balanceKey] || 0;
      if (balance > 0) {
        const newToDate = new Date(formData.fromDate);
        newToDate.setDate(newToDate.getDate() + balance - 1);
        const formattedToDate = newToDate.toISOString().split('T')[0];
        setFormData((prev) => ({ ...prev, toDate: formattedToDate }));
        validateField('toDate', formattedToDate);
      }
    }
  }, [formData.fromDate, formData.leaveType, leaveBalance, validateField]);

  const getLeaveBalance = useCallback(() => {
    if (!leaveBalance || !formData.leaveType) return '0';
    const selectedType = leaveTypes.find((type) => type.value === formData.leaveType);
    return leaveBalance[selectedType?.balanceKey] || '0';
  }, [leaveBalance, formData.leaveType]);

  const calculateDuration = useCallback(() => {
    if (formData.fromDate && formData.toDate) {
      const diffTime = Math.abs(new Date(formData.toDate) - new Date(formData.fromDate));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }, [formData.fromDate, formData.toDate]);

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 dark:text-white tracking-tight">
                  Assign Leave
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-lato">
                  Manage employee leave assignments efficiently
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-sm"
              aria-label="Clear form"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className={`glass-input ${
                    errors.employeeId ? 'border-red-500 ring-red-500' : ''
                  } appearance-none pr-10`}
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
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
              </div>
              {errors.employeeId && (
                <p id="employeeId-error" className="text-xs text-red-500 mt-1 font-lato">
                  {errors.employeeId}
                </p>
              )}
            </div>

            {/* Leave Type and Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => handleChange('leaveType', e.target.value)}
                    className={`glass-input ${
                      errors.leaveType ? 'border-red-500 ring-red-500' : ''
                    } appearance-none pr-10`}
                    aria-invalid={!!errors.leaveType}
                    aria-describedby={errors.leaveType ? 'leaveType-error' : ''}
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                </div>
                {errors.leaveType && (
                  <p id="leaveType-error" className="text-xs text-red-500 mt-1 font-lato">
                    {errors.leaveType}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                  Available Balance
                </label>
                <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-300 font-poppins font-semibold shadow-sm flex items-center justify-center border border-indigo-200/50 dark:border-indigo-700/50">
                  <Clock className="w-4 h-4 mr-2" />
                  {selectedEmployee ? `${getLeaveBalance()} Day(s)` : 'Select an employee'}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => handleChange('fromDate', e.target.value)}
                    className={`glass-input ${
                      errors.fromDate ? 'border-red-500 ring-red-500' : ''
                    } pr-10`}
                    aria-invalid={!!errors.fromDate}
                    aria-describedby={errors.fromDate ? 'fromDate-error' : ''}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                </div>
                {errors.fromDate && (
                  <p id="fromDate-error" className="text-xs text-red-500 mt-1 font-lato">
                    {errors.fromDate}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => handleChange('toDate', e.target.value)}
                    min={formData.fromDate}
                    className={`glass-input ${
                      errors.toDate ? 'border-red-500 ring-red-500' : ''
                    } pr-10`}
                    aria-invalid={!!errors.toDate}
                    aria-describedby={errors.toDate ? 'toDate-error' : ''}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                </div>
                {errors.toDate && (
                  <p id="toDate-error" className="text-xs text-red-500 mt-1 font-lato">
                    {errors.toDate}
                  </p>
                )}
              </div>
            </div>

            {/* Duration Display */}
            {formData.fromDate && formData.toDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 font-poppins font-semibold shadow-sm text-center border border-green-200/50 dark:border-green-700/50"
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  Duration: {calculateDuration()} day(s)
                </div>
              </motion.div>
            )}

            {/* Comments */}
            <div className="space-y-3">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200">
                Additional Comments
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  className="glass-input resize-none"
                  placeholder="Add any additional notes or instructions..."
                  aria-label="Additional comments"
                />
                <FileText className="absolute top-4 right-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Required Text and Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-lato">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={resetForm}
                  className="glass-button-secondary"
                  aria-label="Clear form"
                >
                  Clear Form
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting || !formData.employeeId || !formData.leaveType || !formData.fromDate || !formData.toDate}
                  className="glass-button flex items-center gap-2"
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
                    <>
                      <User className="w-4 h-4" />
                      Assign Leave
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-lato border border-red-200/50 dark:border-red-700/50">
                Error: {submitError?.data?.message || 'Failed to assign leave.'}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignLeave;