import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRegisterUserMutation } from '../../slices/UserApiSlice';
import { Eye, EyeOff, User, Mail, Lock, Building, Calendar, CreditCard, Phone, Briefcase, Map } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/AuthSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Employee details
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    position: 'CEO', // Default position
    employmentDate: new Date().toISOString().split('T')[0], // Today's date
    salary: '0.00',

    // Organization details
    organisationName: '',
    organisationSubdomain: '',
    mpesaPhone: '',
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { isLoading: isRegistering, error: registerError }] = useRegisterUserMutation();

  // Handle API errors with Toastify
  useEffect(() => {
    if (registerError) {
      const message = registerError.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  }, [registerError]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) {
    //   toast.error('Please correct the form errors.');
    //   return;
    // }

    try {
      setIsLoading(true);
      const { confirmPassword, ...registrationData } = formData; // Exclude confirmPassword
      const response = await registerUser(registrationData).unwrap();

      dispatch(setCredentials({ user: response.user, token: response.token }));
      toast.success('Registration successful!');

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        nationalId: '',
        dateOfBirth: '',
        position: 'CEO',
        employmentDate: new Date().toISOString().split('T')[0],
        salary: '0.00',
        organisationName: '',
        organisationSubdomain: '',
        mpesaPhone: '',
      });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      if (err.data?.errors) setErrors(err.data.errors);
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Step 1 validation - User credentials
    if (currentStep === 1 || currentStep === 3) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
        newErrors.email = 'Invalid email address';

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!passwordRegex.test(formData.password))
        newErrors.password =
          'Password must be 8+ characters with uppercase, lowercase, number, and special character';

      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    // Step 2 validation - Personal details
    if (currentStep === 2 || currentStep === 3) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Step 3 validation - Organization details
    if (currentStep === 3) {
      if (!formData.organisationName.trim()) newErrors.organisationName = 'Organization name is required';
      if (!formData.organisationSubdomain.trim()) newErrors.organisationSubdomain = 'Subdomain is required';
      else if (!/^[a-z0-9]+$/.test(formData.organisationSubdomain))
        newErrors.organisationSubdomain = 'Subdomain must contain only lowercase letters and numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for subdomain - convert to lowercase and remove spaces
    if (name === 'organisationSubdomain') {
      const formattedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Auto-generate subdomain from organization name
  const handleOrgNameChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      organisationName: value,
      organisationSubdomain: value.toLowerCase().replace(/[^a-z0-9]/g, '')
    }));
    if (errors.organisationName) setErrors((prev) => ({ ...prev, organisationName: '' }));
  };

  // Handle step navigation
  const nextStep = () => {
    // if (validateStepForm()) {
      setCurrentStep(currentStep + 1);
    
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Validate current step form
  const validateStepForm = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
        newErrors.email = 'Invalid email address';

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!passwordRegex.test(formData.password))
        newErrors.password =
          'Password must be 8+ characters with uppercase, lowercase, number, and special character';

      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-xl text-white mb-4 text-center">Account Information</h3>
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="email"
                name="email"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${errors.password ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-purple-300" />
                ) : (
                  <Eye className="h-5 w-5 text-purple-300" />
                )}
              </button>
              {errors.password && <p className="mt-1 text-red-400 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-purple-300" />
                ) : (
                  <Eye className="h-5 w-5 text-purple-300" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={nextStep}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
            >
              Next
            </motion.button>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-xl text-white mb-4 text-center">Personal Information</h3>

            {/* First Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="firstName"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.firstName ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="lastName"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="mt-1 text-red-400 text-sm">{errors.lastName}</p>}
            </div>

            {/* National ID */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="nationalId"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.nationalId ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="National ID"
                value={formData.nationalId}
                onChange={handleChange}
              />
              {errors.nationalId && <p className="mt-1 text-red-400 text-sm">{errors.nationalId}</p>}
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="date"
                name="dateOfBirth"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.dateOfBirth ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && <p className="mt-1 text-red-400 text-sm">{errors.dateOfBirth}</p>}
            </div>

            {/* Position */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="position"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.position ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
              />
              {errors.position && <p className="mt-1 text-red-400 text-sm">{errors.position}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="w-1/2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Next
              </motion.button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="text-xl text-white mb-4 text-center">Organization Details</h3>

            {/* Organization Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="organisationName"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.organisationName ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Organization Name"
                value={formData.organisationName}
                onChange={handleOrgNameChange}
              />
              {errors.organisationName && <p className="mt-1 text-red-400 text-sm">{errors.organisationName}</p>}
            </div>

            {/* Organization Subdomain */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                name="organisationSubdomain"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.organisationSubdomain ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Subdomain (letters and numbers only)"
                value={formData.organisationSubdomain}
                onChange={handleChange}
              />
              {errors.organisationSubdomain && (
                <p className="mt-1 text-red-400 text-sm">{errors.organisationSubdomain}</p>
              )}
              <p className="mt-1 text-purple-300 text-sm">
                Your HR portal will be available at: {formData.organisationSubdomain || 'yourcompany'}.hrpro.com
              </p>
            </div>

            {/* M-Pesa Phone */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="tel"
                name="mpesaPhone"
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${errors.mpesaPhone ? 'border-red-400' : 'border-purple-400'
                  } rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="M-Pesa Phone (e.g. +254712345678)"
                value={formData.mpesaPhone}
                onChange={handleChange}
              />
              {errors.mpesaPhone && <p className="mt-1 text-red-400 text-sm">{errors.mpesaPhone}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="w-1/2 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-1/2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === step
                  ? 'bg-purple-500 text-white'
                  : currentStep > step
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white/60'
                }`}
            >
              {currentStep > step ? '✓' : step}
            </div>
            {step < 3 && (
              <div
                className={`h-1 w-10 ${currentStep > step ? 'bg-green-500' : 'bg-white/20'
                  }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <ToastContainer />

      {/* Background Animation */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          animate={{
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
            scale: [1, Math.random() * 2 + 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Registration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg backdrop-blur-lg bg-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          Create Account
        </h2>

        {renderProgressIndicator()}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {renderForm()}

          {/* Login Link */}
          <p className="text-center text-white mt-4 sm:mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-purple-300 hover:text-purple-200 font-semibold">
              Login here
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;