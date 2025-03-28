import React, { useState } from 'react';
import { useUpdateOrganizationMutation } from '../../../slices/organizationSlice';
import { Pencil, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useGetOrganisationByIdQuery } from '../../../slices/organizationSlice';

const ViewOrganization = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id);
  const organisationId = employee?.data.employee.organisationId;
  const { data: organisation, isLoading } = useGetOrganisationByIdQuery(organisationId);
  console.log(organisation)

  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    mpesaPhone: '',
    subscriptionStatus: '',
  });

  const openEditModal = () => {
    setFormData({
      name: organisation?.data?.organisation?.name || '',
      subdomain: organisation?.data?.organisation?.subdomain || '',
      mpesaPhone: organisation?.data?.organisation?.mpesaPhone || '',
      subscriptionStatus: organisation?.data.organisation?.subscriptionStatus || '',
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrganization({
        id: organisationId,
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
      setIsEditModalOpen(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Organization
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your organization details
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Name: 
                  {organisation?.data.organisation.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Subdomain: 
                  {organisation?.data.organisation.subdomain}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openEditModal}
                className="p-2 text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-full transition-colors"
                aria-label="Edit organization"
              >
                <Pencil className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-3 mt-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">M-Pesa Phone</label>
                <p className="text-gray-900 dark:text-white">{organisation?.data.organisation.mpesaPhone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Subscription Status</label>
                <p
                  className={`capitalize ${organisation?.data?.organisation?.subscriptionEndDate &&
                      (new Date(organisation.data.organisation.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24) < 10
                      ? "text-red-500"
                      : "text-green-500"
                    }`}
                >
                  {organisation?.data?.organisation?.subscriptionStatus}
                </p>
              </div>

            </div>
          </motion.div>
        </div>

        {isEditModalOpen && (
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
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


                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
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
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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