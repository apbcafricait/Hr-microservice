import React, { useState } from 'react';
import { useGetOrganizationsQuery, useDeleteOrganizationMutation } from '../../../slices/organizationSlice';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const ViewOrganization = () => {
  const { data: organizations, isLoading, isError } = useGetOrganizationsQuery();
  const [deleteOrganization] = useDeleteOrganizationMutation();
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteOrganization(id).unwrap();
      alert('Organization deleted successfully');
    } catch (error) {
      alert('Failed to delete organization');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading organizations</div>;

  // ADD THIS CHECK:  Ensure organizations is an array before mapping
  if (!Array.isArray(organizations)) {
    return <div>No organizations to display.</div>; // Or handle the empty state differently
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Organizations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <motion.div
            key={org.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{org.subdomain}</p>
            <div className="flex space-x-4">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setSelectedOrganization(org)}
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="text-yellow-500 hover:text-yellow-700"
                onClick={() => setSelectedOrganization(org)}
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(org.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

  {selectedOrganization && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Organization</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              defaultValue={selectedOrganization.name}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subdomain</label>
            <input
              type="text"
              defaultValue={selectedOrganization.subdomain}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedOrganization(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
};

export default ViewOrganization;
