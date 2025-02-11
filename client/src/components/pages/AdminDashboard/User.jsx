import React, { useState } from 'react';
import { Search, Plus, Filter, ChevronDown, Edit, Trash } from 'lucide-react';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useCreateUserMutation,
  useUpdateUserMutation
} from '../../../slices/UserApiSlice';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    userRole: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // API hooks
  const { 
    data: usersData, 
    isLoading, 
    isFetching,
    isError,
    error 
  } = useGetUsersQuery({
    search: searchTerm,
    role: filters.userRole,
    status: filters.status,
    page,
    limit: pageSize,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Handlers
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus({ id: userId, status: newStatus }).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser({ id: userId, ...userData }).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const resetFilters = () => {
    setFilters({ userRole: '', status: '' });
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">System Users</h1>
          <button
            onClick={() => {
              // Open modal or navigate to create user form
              handleCreateUser({
                username: '',
                password: '',
                role: '',
                employeeName: '',
                status: 'active'
              });
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={filters.userRole}
                onChange={(e) => {
                  setFilters({ ...filters, userRole: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error?.data?.message || 'Failed to fetch users'}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {/* User Table */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersData && usersData.length > 0 ? (
                  usersData.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.employeeName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpdateUser(user.id, user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && usersData && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-700">
              {usersData.total || 0} Records Found
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={!usersData.hasMore || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;