import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, X, Calendar, User, Clock, FileText, Plus } from 'lucide-react';
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
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
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
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg animate-pulse font-lato">
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-card p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 dark:text-white tracking-tight">
                  Request Time Off
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-lato">
                  Submit your leave application with ease
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className={`glass-input ${
                        errors.selectedLeaveType ? 'border-red-500 ring-red-500' : ''
                      } appearance-none pr-10`}
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
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                    {errors.selectedLeaveType && (
                      <p id="leaveType-error" className="text-xs text-red-500 mt-1 font-lato">
                        {errors.selectedLeaveType}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-poppins font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Leave Type
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
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
                      className={`glass-input ${
                        errors.fromDate ? 'border-red-500 ring-red-500' : ''
                      } pr-10`}
                      placeholderText="Select start date"
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
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Available Balance
                  </label>
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-300 font-poppins font-semibold shadow-sm flex items-center justify-center border border-indigo-200/50 dark:border-indigo-700/50">
                    <Clock className="w-4 h-4 mr-2" />
                    {getLeaveBalance()} Day(s)
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
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
                      className={`glass-input ${
                        errors.toDate ? 'border-red-500 ring-red-500' : ''
                      } pr-10`}
                      placeholderText="End date (auto-filled)"
                      minDate={fromDate}
                      disabled
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
            </div>

            {fromDate && toDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 font-poppins font-semibold shadow-sm text-center border border-green-200/50 dark:border-green-700/50"
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  Duration: {calculateDuration()} day(s)
                </div>
              </motion.div>
            )}

            <div className="mt-8">
              <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Additional Notes
              </label>
              <div className="relative">
                <textarea
                  className="glass-input resize-none"
                  rows="4"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any details or comments..."
                />
                <FileText className="absolute top-4 right-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button-secondary"
                onClick={resetForm}
                aria-label="Clear form"
              >
                Clear Form
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex items-center gap-2"
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
                  <>
                    <User className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </motion.button>
            </div>

            {createError && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-lato border border-red-200/50 dark:border-red-700/50">
                Error: {createError?.data?.message || 'Failed to submit application.'}
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300 font-lato">
      <NoiseBG />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        className="mt-16 z-50"
      />

      <nav className="glass-card sticky top-0 z-10 mx-4 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 py-4">
            {[
              { key: 'apply', label: 'Apply Leave', icon: '📝' },
              { key: 'myLeave', label: 'My Leave', icon: '📋' },
              { key: 'leaveList', label: 'Leave List', icon: '📊' },
              { key: 'assignLeave', label: 'Assign Leave', icon: '👥' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-poppins font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${tab.label} tab`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">
                    Add New Leave Type
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Leave Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newLeaveType.name}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, name: e.target.value });
                      validateField('name', e.target.value);
                    }}
                    className={`glass-input ${
                      errors.name ? 'border-red-500 ring-red-500' : ''
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : ''}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newLeaveType.duration}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, duration: e.target.value });
                      validateField('duration', e.target.value);
                    }}
                    className={`glass-input ${
                      errors.duration ? 'border-red-500 ring-red-500' : ''
                    }`}
                    min="1"
                    aria-invalid={!!errors.duration}
                    aria-describedby={errors.duration ? 'duration-error' : ''}
                  />
                  {errors.duration && (
                    <p id="duration-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-poppins font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newLeaveType.start_date}
                    onChange={(e) => {
                      setNewLeaveType({ ...newLeaveType, start_date: e.target.value });
                      validateField('start_date', e.target.value);
                    }}
                    className={`glass-input ${
                      errors.start_date ? 'border-red-500 ring-red-500' : ''
                    }`}
                    aria-invalid={errors.start_date ? 'true' : 'false'}
                    aria-describedby={errors.start_date ? 'start-date-error' : ''}
                  />
                  {errors.start_date && (
                    <p id="start-date-error" className="text-xs text-red-500 mt-1 font-lato">
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="glass-button-secondary"
                    aria-label="Cancel"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddLeaveType}
                    className="glass-button"
                    disabled={isCreateLeaveTypeLoading || !organisationId}
                    aria-label="Add leave type"
                  >
                    {isCreateLeaveTypeLoading ? 'Adding...' : 'Add Leave Type'}
                  </motion.button>
                </div>

                {createLeaveTypeError && (
                  <p className="text-red-500 text-sm mt-2 font-lato">
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
              className="glass-card p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-gray-900 dark:text-white">
                    Quick Help Guide
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close help modal"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 font-lato">
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