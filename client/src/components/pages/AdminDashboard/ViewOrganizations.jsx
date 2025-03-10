import React, { useState } from 'react';
import { useGetOrganizationsQuery, useDeleteOrganizationMutation, useUpdateOrganizationMutation } from '../../../slices/organizationSlice';
import { Pencil, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewOrganization = () => {
  const { data: organizations, isLoading, isError, refetch } = useGetOrganizationsQuery();
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    mpesaPhone: '',
    subscriptionStatus: '',
  });

  // Handle Delete with Confirmation and Toast
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      try {
        await deleteOrganization(id).unwrap();
        toast.success('Organization deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        refetch();
      } catch (error) {
        toast.error(`Failed to delete organization: ${error?.data?.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  // Open Edit Modal and Populate Form
  const openEditModal = (org) => {
    setSelectedOrganization(org);
    setFormData({
      name: org.name || '',
      subdomain: org.subdomain || '',
      mpesaPhone: org.mpesaPhone || '',
      subscriptionStatus: org.subscriptionStatus || '',
    });
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Update Submission with Toast
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrganization({
        id: selectedOrganization.id,
        body: formData,
      }).unwrap();
      toast.success('Organization updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSelectedOrganization(null);
      refetch();
    } catch (error) {
      toast.error(`Failed to update organization: ${error?.data?.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Loading State
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  // Error State
  if (isError) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-2xl shadow-lg text-red-700 dark:text-red-300">
        Error loading organizations
      </div>
    </div>
  );

  // Empty State
  if (!Array.isArray(organizations) || organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-gray-700 dark:text-gray-300 text-center">
          <p className="text-lg font-medium">No organizations found</p>
          <p className="mt-2">Create an organization to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
            <span>View Organizations</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your organizations with ease
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <motion.div
              key={org.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {org.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 truncate">
                {org.subdomain}.yourdomain.com
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEditModal(org)}
                  className="p-2 text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-full transition-colors"
                  aria-label="Edit organization"
                >
                  <Pencil className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(org.id)}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Delete organization"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        {selectedOrganization && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Edit Organization
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrganization(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subdomain
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="subdomain"
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all"
                      required
                    />
                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                      .yourdomain.com
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    M-Pesa Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="mpesaPhone"
                      id="mpesaPhone"
                      value={formData.mpesaPhone}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subscription Status
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      name="subscriptionStatus"
                      id="subscriptionStatus"
                      value={formData.subscriptionStatus}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm transition-all"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="trial">Trial</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSelectedOrganization(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewOrganization;