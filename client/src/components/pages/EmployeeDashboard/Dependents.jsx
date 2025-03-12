import React, { useState } from 'react';
import { useGetEmployeeDependentsQuery, useCreateDependentMutation, useUpdateDependentMutation, useDeleteDependentMutation, } from '../../../slices/dependentSlice';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Dependents = () => {
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDependentId, setCurrentDependentId] = useState(null);
  const [dependentData, setDependentData] = useState({
    name: '',
    relationship: '',
    dateOfBirth: '',
  });
  const [dependentList, setDependentList] = useState([]); // Renamed local state

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const employeeId = orgEmpData?.data.employee.id;

  // API hooks
  const { data: dependents, isLoading, refetch } = useGetEmployeeDependentsQuery(employeeId);
  const [createDependent] = useCreateDependentMutation();
  const [updateDependent] = useUpdateDependentMutation();
  const [deleteDependent] = useDeleteDependentMutation();

  const handleAddDependent = async () => {
    try {
      await createDependent({ ...dependentData, employeeId }).unwrap();
      refetch(); // Refetch to get the updated dependents list
      resetForm();
    } catch (err) {
      setError('Failed to add dependent. Please try again.');
    }
  };

  const handleEditDependent = async () => {
    try {
      console.log('Updating dependent with ID:', currentDependentId);
      console.log('Data being sent:', dependentData);
  
      const response = await updateDependent({ id: currentDependentId, ...dependentData }).unwrap();
      console.log('Update response:', response);
  
      if (response) {
        // Refetch the updated data from the server
        await refetch();
  
        // Update local state immediately to reflect changes
        setDependentList((prevDependentList) =>
          prevDependentList.map((dependent) =>
            dependent.id === currentDependentId
              ? { ...dependent, ...dependentData }
              : dependent
          )
        );
  
        resetForm(); // Reset the form after successful update
      } else {
        setError('Update was not successful. Please try again.');
      }
    } catch (err) {
      console.error('Error updating dependent:', err);
      setError('Failed to update dependent. Please try again.');
    }
  };
  


  // Function to open the edit modal
  const openEditModal = (dependent) => {
    setDependentData({
      name: dependent.name,
      relationship: dependent.relationship,
      dateOfBirth: dependent.dateOfBirth,
    });
    setCurrentDependentId(dependent.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleRemoveDependent = async (id) => {
    try {
      await deleteDependent(id).unwrap();
      refetch(); // Refetch to get the updated dependents list
    } catch (err) {
      setError('Failed to remove dependent. Please try again.');
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setDependentData({ name: '', relationship: '', dateOfBirth: '' });
    setCurrentDependentId(null);
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Error Handling */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}{' '}
          <button onClick={handleClearError} className="ml-2 text-blue-500 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Dependents Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assigned Dependents</h2>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            + Add
          </button>
        </div>
        <div className="border rounded-lg">
          {isLoading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : dependents?.data.length > 0 ? (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Relationship</th>
                    <th className="px-4 py-2">Date of Birth</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dependents?.data.map((dependent) => (
                    <tr key={dependent.id} className="border-b">
                      <td className="px-4 py-2">{dependent.name}</td>
                      <td className="px-4 py-2">{dependent.relationship}</td>
                      <td className="px-4 py-2">{dependent.dateOfBirth}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => openEditModal(dependent)}
                          className="text-yellow-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleRemoveDependent(dependent.id)}
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="p-4 text-gray-500">No Records Found</p>
          )}
        </div>
      </div>

      {/* Add/Edit Dependent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Dependent' : 'Add Dependent'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={dependentData.name}
              onChange={(e) => setDependentData({ ...dependentData, name: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Relationship"
              value={dependentData.relationship}
              onChange={(e) => setDependentData({ ...dependentData, relationship: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="date"
              value={dependentData.dateOfBirth}
              onChange={(e) => setDependentData({ ...dependentData, dateOfBirth: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button onClick={resetForm} className="mr-4 text-gray-500">
                Cancel
              </button>
              <button
                onClick={isEditing ? handleEditDependent : handleAddDependent}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dependents;
