import React, { useState, useEffect } from 'react';
import { useCreateOrganizationMutation } from '../../../slices/organizationSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Building2, AtSign, Phone, CheckCircle, UserCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const CreateOrganizationForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    mpesaPhone: '',
    subscriptionStatus: '', // Changed from 'trial' to empty string
  });

  const [errors, setErrors] = useState({});
  const [createOrganization, { isLoading, isSuccess, error, data }] = useCreateOrganizationMutation();
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [createdOrg, setCreatedOrg] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      setCreatedOrg(data.organisation);
      setShowSuccessCard(true);
      
      setFormData({
        name: '',
        subdomain: '',
        mpesaPhone: '',
        subscriptionStatus: '', // Changed from 'trial' to empty string
      });
      
      const timer = setTimeout(() => {
        setShowSuccessCard(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.mpesaPhone.trim()) {
      newErrors.mpesaPhone = 'M-Pesa phone number is required';
    } else if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.mpesaPhone)) {
      newErrors.mpesaPhone = 'Please enter a valid Kenyan phone number';
    }
    if (!formData.subscriptionStatus) {
      newErrors.subscriptionStatus = 'Please select a subscription status';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo || !userInfo.id) {
      toast.error('You must be logged in to create an organization');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      const organizationData = {
        ...formData,
        createdBy: userInfo.id
      };
      
      console.log('Sending organization data:', organizationData);
      const result = await createOrganization(organizationData).unwrap();
      toast.success('Organization created successfully!');
    } catch (err) {
      console.error('Failed to create organization:', err);
      const errorMessage = err?.data?.message || err?.message || 'Failed to create organization';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {showSuccessCard && createdOrg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-5 shadow-md"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Organization Created Successfully!</h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                  <p><span className="font-semibold">Name:</span> {createdOrg.name}</p>
                  <p><span className="font-semibold">Subdomain:</span> {createdOrg.subdomain}</p>
                  <p><span className="font-semibold">Created At:</span> {new Date(createdOrg.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setShowSuccessCard(false)}
                  className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 py-6 px-8">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Building2 className="mr-2" size={24} />
              Create New Organization
            </h1>
            <p className="text-blue-100 mt-1">Enter your organization details to get started</p>
          </div>
          
          {userInfo ? (
            <div className="bg-blue-50 dark:bg-blue-900/30 m-6 p-4 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                Creating organization as: <span className="font-medium ml-1">{userInfo.email}</span>
              </p>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/30 m-6 p-4 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300 flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                Warning: You are not logged in. Please log in to create an organization.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="py-8 px-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organization Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm`}
                    placeholder="Acme Corporation"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subdomain
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="subdomain"
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.subdomain ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-l-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm`}
                      placeholder="acme"
                    />
                  </div>
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 sm:text-sm">
                    .yourdomain.com
                  </span>
                </div>
                {errors.subdomain && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subdomain}</p>}
              </div>

              <div>
                <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  M-Pesa Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="mpesaPhone"
                    id="mpesaPhone"
                    value={formData.mpesaPhone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.mpesaPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm`}
                    placeholder="+254712345678"
                  />
                </div>
                {errors.mpesaPhone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mpesaPhone}</p>}
              </div>

              <div>
                <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscription Status
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <select
                    name="subscriptionStatus"
                    id="subscriptionStatus"
                    value={formData.subscriptionStatus}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.subscriptionStatus ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm`}
                  >
                    <option value="">Select Status</option>
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                {errors.subscriptionStatus && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subscriptionStatus}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !userInfo}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Organization'
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <UserCircle className="mr-2 text-blue-500" size={20} />
                Recently Created Organizations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Organizations you've created will appear here
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              {createdOrg ? (
                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{createdOrg.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Created on {new Date(createdOrg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {createdOrg.subscriptionStatus}
                  </span>
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No organizations created yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team at <span className="text-blue-600 dark:text-blue-400">apbcafricait@gmail.com</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateOrganizationForm;