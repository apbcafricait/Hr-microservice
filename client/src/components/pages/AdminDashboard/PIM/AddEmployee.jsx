import { useState, useRef, useCallback } from 'react';
import { Plus, Upload, X, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateEmployeeMutation } from '../../../../slices/employeeSlice';
import {
  useGetOrganizationsQuery,
  useGetOrganisationByIdQuery,
} from '../../../../slices/organizationSlice';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../../slices/employeeSlice';

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")`,
    }}
  />
);

const AddEmployee = () => {
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    nationalId: '', // Reinstated
    dateOfBirth: '',
    position: '',
    employmentDate: '',
    salary: '',
    role: '',
    organisationId: '',
    status: 'Active',
    department: '',
    phoneNumber: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Redux Data Fetching
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading: isLoadingEmployee } = useGetEmployeeQuery(id, { skip: !id });
  const organisationId = employee?.data?.employee?.organisationId;
  const [createEmployee, { isLoading: isCreatingEmployee }] = useCreateEmployeeMutation();
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useGetOrganizationsQuery();
  const { data: organization } = useGetOrganisationByIdQuery(organisationId);

  // Form Validation
  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Valid email is required';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value || value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
      case 'firstName':
      case 'lastName':
      case 'nationalId': // Added validation for nationalId
      case 'organisationId':
        if (!value) {
          newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
        } else if (name === 'nationalId' && !/^\d{8,}$/.test(value)) {
          newErrors.nationalId = 'Valid National ID (8+ digits) required';
        } else {
          delete newErrors[name];
        }
        break;
      case 'salary':
        if (value && isNaN(value)) {
          newErrors.salary = 'Salary must be a valid number';
        } else {
          delete newErrors.salary;
        }
        break;
      case 'phoneNumber':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
          newErrors.phoneNumber = 'Valid phone number required';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // Event Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or GIF file.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        return;
      }
      if (file.size > 1048576) {
        toast.error('File size must be less than 1MB.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const requiredFields = ['email', 'password', 'firstName', 'lastName', 'nationalId', 'organisationId'];
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
        const employeeData = {
          ...formData,
          nationalId: formData.nationalId, // Ensure nationalId is included
          salary: Number(formData.salary) || 0,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : '',
          employmentDate: formData.employmentDate ? new Date(formData.employmentDate).toISOString().split('T')[0] : '',
          organisationId: Number(formData.organisationId),
        };

        await createEmployee(employeeData).unwrap();
        toast.success('Employee added successfully!', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        resetForm();
      } catch (error) {
        toast.error(
          `Failed to add employee: ${error?.data?.message || error.message || 'Unknown error'}`,
          {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          }
        );
      }
    },
    [formData, createEmployee]
  );

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      nationalId: '', // Reinstated
      dateOfBirth: '',
      position: '',
      employmentDate: '',
      salary: '',
      role: '',
      organisationId: '',
      status: 'Active',
      department: '',
      phoneNumber: '',
    });
    setPreviewImage(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // Glassmorphism Style
  const glassStyle = `backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-100/20 dark:border-gray-800/20 shadow-2xl rounded-2xl transition-all duration-300`;

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500 font-inter">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${glassStyle} p-6 sm:p-8`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Add New Employee
            </h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetForm}
              className="p-2.5 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="Clear form"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full bg-indigo-50/50 dark:bg-indigo-900/20 overflow-hidden shadow-md">
                {previewImage ? (
                  <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="h-12 w-12 text-indigo-400" />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile image"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.png,.gif"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                JPG, PNG, GIF up to 1MB (200px × 200px)
              </p>
            </div>

            {/* Personal Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 tracking-tight">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : ''}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-xs text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : ''}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-xs text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    National ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="National ID"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.nationalId ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.nationalId}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.nationalId}
                    aria-describedby={errors.nationalId ? 'nationalId-error' : ''}
                  />
                  {errors.nationalId && (
                    <p id="nationalId-error" className="text-xs text-red-500 mt-1">
                      {errors.nationalId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="+123 456 7890"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : ''}
                  />
                  {errors.phoneNumber && (
                    <p id="phoneNumber-error" className="text-xs text-red-500 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 tracking-tight">
                Employment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Employment Date
                  </label>
                  <input
                    type="date"
                    name="employmentDate"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm"
                    value={formData.employmentDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.salary ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.salary}
                    onChange={handleChange}
                    aria-invalid={!!errors.salary}
                    aria-describedby={errors.salary ? 'salary-error' : ''}
                  />
                  {errors.salary && (
                    <p id="salary-error" className="text-xs text-red-500 mt-1">
                      {errors.salary}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 appearance-none transition-all duration-200 shadow-sm"
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 appearance-none transition-all duration-200 shadow-sm"
                    >
                      <option value="">Select Role</option>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 appearance-none transition-all duration-200 shadow-sm"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization & Login Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 tracking-tight">
                Organization & Login Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="organisationId"
                      value={formData.organisationId}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-sm border ${
                        errors.organisationId ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 appearance-none transition-all duration-200 shadow-sm`}
                      required
                      disabled={isLoadingOrganizations || isLoadingEmployee}
                      aria-invalid={!!errors.organisationId}
                      aria-describedby={errors.organisationId ? 'organisationId-error' : ''}
                    >
                      <option value="">Select Organization</option>
                      {organization?.data?.organisation && (
                        <option
                          key={organization.data.organisation.id}
                          value={organization.data.organisation.id}
                        >
                          {organization.data.organisation.name}
                        </option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                  </div>
                  {errors.organisationId && (
                    <p id="organisationId-error" className="text-xs text-red-500 mt-1">
                      {errors.organisationId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="employee@example.com"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.email ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : ''}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 text-sm border ${
                        errors.password ? 'border-red-500' : 'border-gray-200/50 dark:border-gray-700/50'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 transition-all duration-200 shadow-sm`}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : ''}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Required Field Note */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="text-red-500">*</span> Required fields
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={resetForm}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-sm"
                aria-label="Cancel and reset form"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isCreatingEmployee || isLoadingOrganizations || isLoadingEmployee}
                className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Save employee"
              >
                {isCreatingEmployee ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Employee'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEmployee;