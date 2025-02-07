import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { useNavigate } from 'react-router-dom';
import { useCreateOrganizationMutation, useGetOrganizationsQuery } from '../../../slices/organizationSlice';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, AtSign, Phone, Globe, MapPin, Users,
  Briefcase, Calendar, DollarSign, FileText, Link,
  User, Mail, Check
} from 'lucide-react';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const [createOrganization, { isLoading }] = useCreateOrganizationMutation();
  const { data: organizations, isLoading: isLoadingOrgs } = useGetOrganizationsQuery();

  const initialFormData = {
    name: '',
    subdomain: '',
    mpesaPhone: '',
    managerEmail: '',
    address: '',
    employeeCount: '',
    industry: '',
    foundingDate: '',
    annualRevenue: '',
    registrationNumber: '',
    website: '',
    taxId: '',
    primaryContactName: '',
    primaryContactEmail: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // useRef for automatically focusing the first input field
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Focus the first input field when the component mounts
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Organization name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';

      case 'subdomain':
        if (!value.trim()) return 'Subdomain is required';
        if (!/^[a-z0-9-]+$/.test(value)) return 'Only lowercase letters, numbers, and hyphens allowed';
        return '';

      case 'mpesaPhone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+254[0-9]{9}$/.test(value)) return 'Invalid phone format (+254XXXXXXXXX)';
        return '';

      case 'managerEmail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';

      case 'employeeCount':
        if (value && isNaN(value)) return 'Must be a number';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the form errors');
      return;
    }

    try {
      await createOrganization(formData).unwrap();
      setShowSuccessModal(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (err) {
      toast.error(err.data?.message || 'Failed to create organization');
    }
  };

  const InputField = ({ name, label, type = 'text', icon: Icon, placeholder, required = false, inputRef }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label} {required && '*'}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`block w-full pl-10 pr-3 py-2 border ${errors[name] ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm dark:bg-slate-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          placeholder={placeholder}
          ref={inputRef} // Apply the ref to the input
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">Create New Organization</h2> {/* Centered header */}
            <p className="mt-1 text-indigo-100 text-center">Fill in the organization details below</p> {/* Centered subheader */}
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Required Fields Section */}
              <InputField
                name="name"
                label="Organization Name"
                icon={Building2}
                placeholder="Enter organization name"
                required
                inputRef={firstInputRef} // Apply the ref to the first input
              />
              <InputField
                name="subdomain"
                label="Subdomain"
                icon={Globe}
                placeholder="your-subdomain"
                required
              />
              <InputField
                name="mpesaPhone"
                label="M-Pesa Phone"
                icon={Phone}
                placeholder="+254XXXXXXXXX"
                required
              />
              <InputField
                name="managerEmail"
                label="Manager Email"
                icon={AtSign}
                type="email"
                placeholder="manager@example.com"
                required
              />

              {/* Additional Details */}
              <InputField
                name="address"
                label="Physical Address"
                icon={MapPin}
                placeholder="Organization address"
              />
              <InputField
                name="employeeCount"
                label="Number of Employees"
                icon={Users}
                type="number"
                placeholder="100"
              />
              <InputField
                name="industry"
                label="Industry"
                icon={Briefcase}
                placeholder="e.g. Technology"
              />
              <InputField
                name="foundingDate"
                label="Founding Date"
                icon={Calendar}
                type="date"
              />
              <InputField
                name="annualRevenue"
                label="Annual Revenue (USD)"
                icon={DollarSign}
                placeholder="Annual revenue"
              />
              <InputField
                name="registrationNumber"
                label="Registration Number"
                icon={FileText}
                placeholder="Business registration number"
              />
              <InputField
                name="website"
                label="Website"
                icon={Link}
                placeholder="https://example.com"
              />
              <InputField
                name="taxId"
                label="Tax ID"
                icon={FileText}
                placeholder="Tax identification number"
              />
              <InputField
                name="primaryContactName"
                label="Primary Contact Name"
                icon={User}
                placeholder="Contact person name"
              />
              <InputField
                name="primaryContactEmail"
                label="Primary Contact Email"
                icon={Mail}
                type="email"
                placeholder="contact@example.com"
              />

              {/* Description Field - Full Width */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Brief description of the organization"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating...
                  </>
                ) : (
                  'Create Organization'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Organization Created Successfully
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Redirecting to dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateOrganization;
