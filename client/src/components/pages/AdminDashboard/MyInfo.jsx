import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Briefcase, Building,
  CreditCard, IdCard, Edit, X
} from 'lucide-react';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useUpdateEmployeeMutation } from '../../../slices/employeeSlice';
import { toast } from 'react-toastify';

const MyInfo = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);
  const [isOpen, setIsOpen] = useState(false);
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
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
  // Add the mutation hook

  // Add form state
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the employee ID from the data
      const employeeId = employee?.data?.employee?.id;

      if (!employeeId) {
        console.error('Employee ID not found');
        return;
      }

      // Prepare the data for the mutation
      const body = {
        ...formData,
        // Convert string values to appropriate types
        salary: formData.salary ? Number(formData.salary) : undefined,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined
      };
  const id = employeeId
      // Call the mutation
    const res =   await updateEmployee({id, body}).unwrap();
    console.log(res)

      // Close the modal on success
      

      // You can add a toast notification here if you want
      toast.success('Employee information updated successfully');

    } catch (err) {
      console.error('Failed to update employee:', err);
      // You can add error handling here
      toast.error('Failed to update employee information');
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg border-l-4 border-red-500">
          <h3 className="text-red-500 font-semibold text-lg mb-2">Error Loading Data</h3>
          <p className="text-gray-700 dark:text-gray-300">
            We couldn't load your information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Use actual data or fallback to empty object if not available
  const employeeData = employee?.data?.employee || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Employee Information
        </h1>

        {/* Main Info Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6"
          whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with background */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex items-center justify-center">
                    <User size={36} className="text-gray-400 dark:text-gray-300" />
                  </div>
                </motion.div>
                <motion.button
                  onClick={() => setIsOpen(true)}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit size={14} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 px-6 pb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {employeeData.firstName} {employeeData.lastName}
              </h2>
              <p className="text-blue-500 dark:text-blue-400 font-medium">
                {employeeData.position}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {employeeData.organisation?.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoItem
                  icon={<Mail />}
                  label="Email"
                  value={employeeData.user?.email || 'N/A'}
                />

                <InfoItem
                  icon={<IdCard />}
                  label="National ID"
                  value={employeeData.nationalId || 'N/A'}
                />

                <InfoItem
                  icon={<Calendar />}
                  label="Date of Birth"
                  value={formatDate(employeeData.dateOfBirth)}
                />

                <InfoItem
                  icon={<Building />}
                  label="Department ID"
                  value={employeeData.departmentId || 'N/A'}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoItem
                  icon={<Briefcase />}
                  label="Employment Date"
                  value={formatDate(employeeData.employmentDate)}
                />

                <InfoItem
                  icon={<CreditCard />}
                  label="Salary"
                  value={formatCurrency(employeeData.salary)}
                />

                <InfoItem
                  icon={<User />}
                  label="Role"
                  value={employeeData.user?.role || 'N/A'}
                />

                <InfoItem
                  icon={<Calendar />}
                  label="Last Updated"
                  value={formatDate(employeeData.updatedAt)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Modal - Custom implementation without @headlessui/react */}
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center min-h-screen">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      National ID
                    </label>
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employment Date
                    </label>
                    <input
                      type="date"
                      name="employmentDate"
                      value={formData.employmentDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department ID
                    </label>
                    <input
                      type="number"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  disabled={isUpdating}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper component for info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="mt-0.5 text-blue-500 dark:text-blue-400 mr-3">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  </div>
);

export default MyInfo;