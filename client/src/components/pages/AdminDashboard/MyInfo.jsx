import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, Briefcase, Building,
  CreditCard, IdCard, Edit, X, Camera, Activity, Sun, Moon
} from 'lucide-react';
import { useGetEmployeeQuery, useUpdateEmployeeMutation } from '../../../slices/employeeSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyInfo = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    position: '',
    dateOfBirth: '',
    employmentDate: '',
    salary: '',
    departmentId: ''
  });

  // Mock activity log data (replace with actual API call if available)
  const activityLog = [
    { id: 1, action: 'Updated profile', timestamp: '2025-06-23T10:30:00Z' },
    { id: 2, action: 'Changed position', timestamp: '2025-06-22T14:15:00Z' },
    { id: 3, action: 'Updated salary', timestamp: '2025-06-20T09:00:00Z' }
  ];

  // Update form data when employee data is loaded
  useEffect(() => {
    if (employee?.data?.employee) {
      const emp = employee.data.employee;
      setFormData({
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        nationalId: emp.nationalId || '',
        position: emp.position || '',
        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
        employmentDate: emp.employmentDate ? emp.employmentDate.split('T')[0] : '',
        salary: emp.salary || '',
        departmentId: emp.departmentId || ''
      });
    }
  }, [employee]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
      toast.success('Profile image uploaded successfully');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeId = employee?.data?.employee?.id;
      if (!employeeId) {
        toast.error('Employee ID not found');
        return;
      }

      const body = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : undefined,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined
      };

      await updateEmployee({ id: employeeId, body }).unwrap();
      setIsOpen(false);
      toast.success('Employee information updated successfully');
    } catch (err) {
      console.error('Failed to update employee:', err);
      toast.error('Failed to update employee information');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-lg shadow-xl border border-white/30">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-700 font-lato font-medium">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-lg shadow-xl border-l-4 border-red-500">
          <h3 className="text-red-500 font-poppins font-semibold text-lg mb-2">Error Loading Data</h3>
          <p className="text-gray-700 font-lato">We couldn't load your information. Please try again later.</p>
        </div>
      </div>
    );
  }

  const employeeData = employee?.data?.employee || {};

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-indigo-50 to-purple-50'} font-lato p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Lato:wght@400;500&display=swap');
        body {
          font-family: 'Lato', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white">My Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm shadow-md"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </motion.button>
        </div>

        {/* Main Info Card */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30 mb-8"
          whileHover={{ boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Gradient */}
          <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-700">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-gray-400 dark:text-gray-300" />
                    )}
                  </div>
                </motion.div>
                <motion.label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full shadow-md cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera size={16} />
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </motion.label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">
                  {employeeData.firstName} {employeeData.lastName}
                </h2>
                <p className="text-indigo-500 dark:text-indigo-400 font-poppins font-medium">
                  {employeeData.position}
                </p>
                <p className="text-gray-500 dark:text-gray-400 font-lato text-sm mt-1">
                  {employeeData.organisation?.name}
                </p>
              </div>
              <motion.button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit size={16} /> Edit Profile
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoItem icon={<Mail size={20} className="text-indigo-500" />} label="Email" value={employeeData.user?.email || 'N/A'} />
                <InfoItem icon={<IdCard size={20} className="text-indigo-500" />} label="National ID" value={employeeData.nationalId || 'N/A'} />
                <InfoItem icon={<Calendar size={20} className="text-indigo-500" />} label="Date of Birth" value={formatDate(employeeData.dateOfBirth)} />
                <InfoItem icon={<Building size={20} className="text-indigo-500" />} label="Department ID" value={employeeData.departmentId || 'N/A'} />
              </div>
              <div className="space-y-4">
                <InfoItem icon={<Briefcase size={20} className="text-indigo-500" />} label="Employment Date" value={formatDate(employeeData.employmentDate)} />
                <InfoItem icon={<CreditCard size={20} className="text-indigo-500" />} label="Salary" value={formatCurrency(employeeData.salary)} />
                <InfoItem icon={<User size={20} className="text-indigo-500" />} label="Role" value={employeeData.user?.role || 'N/A'} />
                <InfoItem icon={<Calendar size={20} className="text-indigo-500" />} label="Last Updated" value={formatDate(employeeData.updatedAt)} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Log Section */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-poppins font-semibold text-gray-900 dark:text-white">Activity Log</h3>
            <motion.button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Activity size={16} /> {showActivityLog ? 'Hide' : 'Show'} Activity
            </motion.button>
          </div>
          <AnimatePresence>
            {showActivityLog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                {activityLog.length > 0 ? (
                  activityLog.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-gray-700/50 rounded-lg">
                      <Activity size={16} className="text-indigo-500" />
                      <div>
                        <p className="text-gray-700 dark:text-gray-200 font-lato">{log.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-lato">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 font-lato text-center">No activity recorded</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl m-4 border border-white/30"
              >
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
                <div className="p-8">
                  <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">National ID</label>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Employment Date</label>
                      <input
                        type="date"
                        name="employmentDate"
                        value={formData.employmentDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Salary</label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-lato">Department ID</label>
                      <input
                        type="number"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white font-lato transition-all duration-300"
                      />
                    </div>
                  </form>
                  <div className="mt-6 flex justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2 text-sm font-lato font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md transition-colors"
                      disabled={isUpdating}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="px-6 py-2 text-sm font-lato font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md transition-colors"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Helper component for info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="mt-0.5 text-indigo-500 dark:text-indigo-400 mr-3">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-lato">{label}</p>
      <p className="text-gray-800 dark:text-gray-200 font-lato">{value}</p>
    </div>
  </div>
);

export default MyInfo;