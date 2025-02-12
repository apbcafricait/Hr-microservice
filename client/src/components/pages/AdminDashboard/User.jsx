import React, { useState } from 'react';
import { Search, Plus, Filter, ChevronDown, Edit, Trash } from 'lucide-react';
import {
  useGetAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '../../../slices/employeeSlice'

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // API hooks
  const { 
    data: employeesData, 
    isLoading, 
    isFetching,
    isError,
    error 
  } = useGetAllEmployeesQuery({
    page,
    limit: pageSize,
    search: searchTerm,
    role: filters.role,
  });

  console.log(employeesData?.data?.employees, "employee data")
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  // Handlers
  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  const handleUpdateEmployee = async (employeeId, employeeData) => {
    try {
      await updateEmployee({ id: employeeId, body: employeeData }).unwrap();
      // Toast notification can be added here
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const resetFilters = () => {
    setFilters({ role: '', status: '' });
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Employee Management</h1>
          <button
            onClick={() => handleCreateEmployee({
              firstName: '',
              lastName: '',
              role: '',
              organisationId: '',
              status: 'active'
            })}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
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
                value={filters.role}
                onChange={(e) => {
                  setFilters({ ...filters, role: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">All Roles</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
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
            <span className="block sm:inline">{error?.data?.message || 'Failed to fetch employees'}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {/* Employee Table */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
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
                {employeesData ? (
                  employeesData?.data?.employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.organisation.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpdateEmployee(employee.id, employee)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
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
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && employeesData && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-700">
              {employeesData.total || 0} Records Found
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
                disabled={!employeesData.hasMore || isFetching}
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