import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignLeave from '../../../pages/AdminDashboard/Leave Dashboard/AssignLeave';
import LeaveList from './LeaveList';
import MyLeave from '../../AdminDashboard/Leave Dashboard/MyLeave';
import { useCreateLeaveRequestMutation } from '../../../../slices/leaveApiSlice';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../../slices/employeeSlice';
import {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
} from '../../../../slices/LeaveTypesApiSlice';

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

const LeaveApplication = () => {
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [comments, setComments] = useState('');
  const [activeTab, setActiveTab] = useState('apply');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    duration: '',
    start_date: '',
  });

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id, { skip: !id });
  const organisationId = orgEmpData?.data.employee.organisation.id;
  const employeeId = orgEmpData?.data.employee.id;

  const [createLeaveRequest, { isLoading: isCreateLoading, error: createError }] =
    useCreateLeaveRequestMutation();
  const [createLeaveType, { isLoading: isCreateLeaveTypeLoading, error: createLeaveTypeError }] =
    useCreateLeaveTypeMutation();
  const { data: leaveTypesData } = useGetLeaveTypesQuery(
    { organisationId },
    { skip: !organisationId }
  );

  const leaveTypes = leaveTypesData || [];

  // Validate form fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'selectedLeaveType':
        if (!value) newErrors.selectedLeaveType = 'Leave type is required';
        else delete newErrors.selectedLeaveType;
        break;
      case 'fromDate':
        if (!value) newErrors.fromDate = 'Start date is required';
        else delete newErrors.fromDate;
        break;
      case 'toDate':
        if (!value) newErrors.toDate = 'End date is required';
        else if (value < fromDate) newErrors.toDate = 'End date cannot be before start date';
        else delete newErrors.toDate;
        break;
      case 'name':
        if (!value) newErrors.name = 'Leave type name is required';
        else delete newErrors.name;
        break;
      case 'duration':
        if (!value || value <= 0) newErrors.duration = 'Valid duration (days) is required';
        else delete newErrors.duration;
        break;
      case 'start_date':
        if (!value) newErrors.start_date = 'Start date is required';
        else delete newErrors.start_date;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get leave balance
  const getLeaveBalance = () => {
    return leaveTypes.find((leave) => leave.name === selectedLeaveType)?.duration || 0;
  };

  // Auto-calculate end date based on leave balance
  useEffect(() => {
    if (fromDate && selectedLeaveType) {
      const balanceDays = getLeaveBalance();
      if (balanceDays > 0) {
        const newToDate = new Date(fromDate);
        newToDate.setDate(newToDate.getDate() + balanceDays - 1);
        setToDate(newToDate);
        validateField('toDate', newToDate);
      }
    }
  }, [fromDate, selectedLeaveType]);

  // Calculate duration
  const calculateDuration = () => {
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // Handle adding new leave type
  const handleAddLeaveType = async () => {
    const isValid = ['name', 'duration', 'start_date'].every((field) =>
      validateField(field, newLeaveType[field])
    );

    if (!isValid || !organisationId) {
      toast.error('Please fill in all required fields correctly.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg',
      });
      return;
    }

    try {
      await createLeaveType({
        name: newLeaveType.name,
        duration: parseInt(newLeaveType.duration),
        start_date: newLeaveType.start_date,
        organisationId,
      }).unwrap();
      toast.success('Leave type added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg',
      });
      setNewLeaveType({ name: '', duration: '', start_date: '' });
      setIsModalOpen(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to add leave type.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg',
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const isValid = ['selectedLeaveType', 'fromDate', 'toDate'].every((field) =>
      validateField(field, eval(field))
    );

    if (!isValid) {
      toast.error('Please correct the errors in the form.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg',
      });
      return;
    }

    try {
      const newLeaveRequest = {
        employeeId,
        type: selectedLeaveType,
        startDate: fromDate?.toISOString(),
        endDate: toDate?.toISOString(),
        comments,
        duration: calculateDuration(),
      };
      await createLeaveRequest(newLeaveRequest).unwrap();
      toast.success('Leave request submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg',
      });
      resetForm();
    } catch (error) {
      toast.error('Failed to submit leave request.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-red-500 text-white rounded-lg shadow-lg',
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedLeaveType('');
    setFromDate(null);
    setToDate(null);
    setComments('');
    setErrors({});
  };

  // Render content based on active tab
  const renderContent = () => {
    if (isCreateLeaveTypeLoading) {
      return (
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg animate-pulse">
          Loading your leave information...
        </div>
      );
    }

    switch (activeTab) {
      case 'myLeave':
        return <MyLeave />;
      case 'leaveList':
        return <LeaveList />;
      case 'assignLeave':
        return <AssignLeave />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-100/30 dark:border-gray-800/30 shadow-lg rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-8 tracking-tight">
              Request Time Off
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full rounded-lg border ${
                        errors.selectedLeaveType ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } py-2.5 px-4 text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm appearance-none`}
                      value={selectedLeaveType}
                      onChange={(e) => {
                        setSelectedLeaveType(e.target.value);
                        validateField('selectedLeaveType', e.target.value);
                      }}
                      aria-invalid={!!errors.selectedLeaveType}
                      aria-describedby={errors.selectedLeaveType ? 'leaveType-error' : ''}
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((leave) => (
                        <option key={leave.id} value={leave.name}>
                          {leave.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                    {errors.selectedLeaveType && (
                      <p id="leaveType-error" className="text-xs text-red-500 mt-1">
                        {errors.selectedLeaveType}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    + Add New Leave Type
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => {
                        setFromDate(date);
                        validateField('fromDate', date);
                      }}
                      dateFormat="MM/dd/yyyy"
                      className={`w-full p-2.5 rounded-lg border ${
                        errors.fromDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm`}
                      placeholderText="Select start date"
                      aria-invalid={!!errors.fromDate}
                      aria-describedby={errors.fromDate ? 'fromDate-error' : ''}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                    {errors.fromDate && (
                      <p id="fromDate-error" className="text-xs text-red-500 mt-1">
                        {errors.fromDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Available Balance
                  </label>
                  <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shadow-sm">
                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                      {getLeaveBalance()} Day(s)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => {
                        setToDate(date);
                        validateField('toDate', date);
                      }}
                      dateFormat="MM/dd/yyyy"
                      className={`w-full p-2.5 rounded-lg border ${
                        errors.toDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } text-sm bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm`}
                      placeholderText="End date (auto-filled)"
                      minDate={fromDate}
                      disabled
                      aria-invalid={!!errors.toDate}
                      aria-describedby={errors.toDate ? 'toDate-error' : ''}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                    {errors.toDate && (
                      <p id="toDate-error" className="text-xs text-red-500 mt-1">
                        {errors.toDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {fromDate && toDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium shadow-sm"
              >
                Duration: {calculateDuration()} day(s)
              </motion.div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Additional Notes
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any details or comments..."
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                onClick={resetForm}
                aria-label="Clear form"
              >
                Clear Form
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleSubmit}
                disabled={isCreateLoading || !selectedLeaveType || !fromDate || !toDate}
                aria-label="Submit leave request"
              >
                {isCreateLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </motion.button>
            </div>

            {createError && (
              <div className="mt-4 text-red-500 text-sm">
                Error: {createError?.data?.message || 'Failed to submit application.'}
              </div>
            )}
          </motion.div>
        );
    }
  };

  // Glassmorphism style
  const glass =
    'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-100/30 dark:border-gray-800/30 shadow-lg rounded-2xl';

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300 font-inter">
      <NoiseBG />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        className="mt-16 z-50"
      />

      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 py-4">
            {['apply', 'myLeave', 'leaveList', 'assignLeave'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${tab.replace(/([A-Z])/g, ' $1').trim()} tab`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Add Leave Type Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className={`${glass} p-6 w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
                  Add New Leave Type
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Leave Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLeaveType.name}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, name: e.target.value });
                      validateField('name', e.target.value);
                    }}
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : ''}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newLeaveType.duration}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, duration: e.target.value });
                      validateField('duration', e.target.value);
                    }}
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.duration ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm`}
                    min="1"
                    aria-invalid={!!errors.duration}
                    aria-describedby={errors.duration ? 'duration-error' : ''}
                  />
                  {errors.duration && (
                    <p id="duration-error" className="text-xs text-red-500 mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newLeaveType.start_date}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, start_date: e.target.value });
                      validateField('start_date', e.target.value);
                    }}
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.start_date ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm`}
                    aria-invalid={errors.start_date ? 'true' : 'false'}
                    aria-describedby={errors.start_date ? 'start-date-error' : ''}
                  />
                  {errors.start_date && (
                    <p id="start-date-error" className="text-xs text-red-500 mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                    aria-label="Cancel"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddLeaveType}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreateLeaveTypeLoading || !organisationId}
                    aria-label="Add leave type"
                  >
                    {isCreateLeaveTypeLoading ? 'Adding...' : 'Add Leave Type'}
                  </motion.button>
                </div>

                {createLeaveTypeError && (
                  <p className="text-red-500 text-sm mt-2">
                    Failed to add leave type: {createLeaveTypeError?.data?.message || 'Unknown error.'}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
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
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="text-sm">Here's how to request your leave:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Select your leave type from the dropdown</li>
                  <li>Choose a start date; end date will auto-fill based on balance</li>
                  <li>Add optional comments for additional details</li>
                  <li>Click "Submit Request" to send your application</li>
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
    </div>
  );
};

export default LeaveApplication;