import { useState, useRef } from 'react';
import { Plus, Upload, X, ChevronDown, Eye, EyeOff, FileText } from 'lucide-react';
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
    className="pointer-events-none fixed inset-0 z-0 opacity-10"
    style={{
      backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.10"/></svg>')`,
    }}
  />
);

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    position: '',
    employmentDate: '',
    salary: '',
    role: '',
    organisationId: '',
    status: 'Active',
    department: '', // New field
    phoneNumber: '', // New field
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id, { skip: !id });
  const organisationId = employee?.data.employee.organisationId;

  const [createEmployee, { isLoading: isCreatingEmployee }] = useCreateEmployeeMutation();
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useGetOrganizationsQuery();
  const { data: organization } = useGetOrganisationByIdQuery(organisationId);

  // Validate form fields
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = 'Valid email is required';
        else delete newErrors.email;
        break;
      case 'password':
        if (!value || value.length < 8)
          newErrors.password = 'Password must be at least 8 characters';
        else delete newErrors.password;
        break;
      case 'firstName':
      case 'lastName':
      case 'organisationId':
        if (!value) newErrors[name] = `${name.replace(/([A-Z])/g, ' $1')} is required`;
        else delete newErrors[name];
        break;
      case 'nationalId':
        if (value && !/^\d{8,}$/.test(value))
          newErrors.nationalId = 'Valid National ID (8+ digits) required';
        else delete newErrors.nationalId;
        break;
      case 'salary':
        if (value && isNaN(value))
          newErrors.salary = 'Salary must be a valid number';
        else delete newErrors.salary;
        break;
      case 'phoneNumber':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value))
          newErrors.phoneNumber = 'Valid phone number required';
        else delete newErrors.phoneNumber;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or GIF file.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          className: 'bg-red-500 text-white rounded-lg shadow-lg',
        });
        return;
      }
      if (file.size > 1048576) {
        toast.error('File size must be less than 1MB.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          className: 'bg-red-500 text-white rounded-lg shadow-lg',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          className: 'bg-red-500 text-white rounded-lg shadow-lg',
        });
        return;
      }
      if (file.size > 5242880) {
        toast.error('File size must be less than 5MB.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          className: 'bg-red-500 text-white rounded-lg shadow-lg',
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = [
      'email',
      'password',
      'firstName',
      'lastName',
      'organisationId',
      'nationalId',
      'salary',
      'phoneNumber',
    ].every((field) => validateField(field, formData[field]));

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
      const employeeData = {
        ...formData,
        salary: Number(formData.salary) || 0,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
          : '',
        employmentDate: formData.employmentDate
          ? new Date(formData.employmentDate).toISOString().split('T')[0]
          : '',
        organisationId: Number(formData.organisationId),
      };

      // Note: Resume and image uploads require server-side handling
      await createEmployee(employeeData).unwrap();
      toast.success('Employee added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        className: 'bg-green-500 text-white rounded-lg shadow-lg',
      });
      resetForm();
    } catch (error) {
      toast.error(
        `Failed to add employee: ${error?.data?.message || error.message || 'Unknown error'}`,
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'light',
          className: 'bg-red-500 text-white rounded-lg shadow-lg',
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      nationalId: '',
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
    setResumeFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  // Glassmorphism style
  const glass =
    'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-100/30 dark:border-gray-800/30 shadow-lg rounded-2xl';

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300 font-inter">
      <NoiseBG />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        className="mt-16 z-50"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${glass} p-6 sm:p-8`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-100 tracking-tight">
              Add New Employee
            </h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetForm}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear form"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image and Resume Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden shadow-md">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="h-12 w-12 text-indigo-400" />
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 transition-colors shadow-sm"
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
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3">
                  JPG, PNG, GIF up to 1MB (200px × 200px)
                </p>
              </div>
              <div className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                >
                  <FileText size={18} />
                  {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                </motion.button>
                <input
                  type="file"
                  ref={resumeInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                />
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
                  PDF up to 5MB
                </p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
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
                      errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
                      errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
                    National ID
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="National ID"
                    className={`w-full px-4 py-2.5 text-sm border ${
                      errors.nationalId ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
                    value={formData.nationalId}
                    onChange={handleChange}
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
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
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
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
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
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm"
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
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm"
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
                      errors.salary ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 appearance-none transition-all duration-200 shadow-sm"
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 appearance-none transition-all duration-200 shadow-sm"
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
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 appearance-none transition-all duration-200 shadow-sm"
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

            {/* Organization and Login Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
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
                        errors.organisationId ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 appearance-none transition-all duration-200 shadow-sm`}
                      required
                      disabled={isLoadingOrganizations}
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
                      errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
                        errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-800/80 transition-all duration-200 shadow-sm`}
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
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isCreatingEmployee || isLoadingOrganizations}
                className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreatingEmployee ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
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