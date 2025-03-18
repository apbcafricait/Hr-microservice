import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, ChevronDown, Edit, Trash, X } from 'lucide-react';
import {
  useGetAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '../../../slices/employeeSlice';
import { useGetOrganizationsQuery } from '../../../slices/organizationSlice';
import { toast } from 'react-toastify';

const UserManagement = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: '', organization: '' });
  const [roleFilter, setRoleFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    nationalId: '',
    dateOfBirth: '',
    position: '',
    employmentDate: '',
    salary: '',
    role: '',
    organisationId: '',
  });

  // API Hooks with debounced search and filter
  const {
    data: employeesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllEmployeesQuery({
    page,
    limit: pageSize,
    search: searchQuery,
    role: roleFilter,
    organization: orgFilter,
  });

  const { data: organizationsData, isLoading: isLoadingOrganizations } = useGetOrganizationsQuery();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
      setRoleFilter(filters.role);
      setOrgFilter(filters.organization);
    }, 500);
  
    return () => clearTimeout(timer);
  }, [searchTerm, filters.role, filters.organization]);
  // Calculate total pages for pagination
  const totalRecords = employeesData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Memoize the employee data to prevent unnecessary re-renders
  const employees = useMemo(() => {
    return employeesData?.data?.employees || [];
  }, [employeesData]);

  // Handlers
  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId).unwrap();
        refetch();
        toast.success('Employee deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (err) {
        console.error('Failed to delete employee:', err);
        toast.error(`Failed to delete employee: ${err?.data?.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await createEmployee({
          ...employeeForm,
          salary: parseFloat(employeeForm.salary),
        }).unwrap();
        toast.success('Employee added successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await updateEmployee({
          id: selectedEmployee.id,
          body: {
            ...employeeForm,
            salary: parseFloat(employeeForm.salary),
          },
        }).unwrap();
        toast.success('Employee updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setIsEmployeeModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error('Failed to save employee:', err);
      toast.error(`Failed to save employee: ${err?.data?.message || 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const resetForm = () => {
    setEmployeeForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      nationalId: '',
      dateOfBirth: '',
      position: '',
      employmentDate: '',
      salary: '',
      role: '',
      organisationId: '',
    });
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setIsEmployeeModalOpen(true);
  };

  const openEditModal = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setEmployeeForm({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      nationalId: employee.nationalId || '',
      dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
      position: employee.position || '',
      employmentDate: employee.employmentDate ? new Date(employee.employmentDate).toISOString().split('T')[0] : '',
      salary: employee.salary?.toString() || '',
      role: employee.user?.role || '',
      organisationId: employee.organisation?.id || '',
    });
    setIsEmployeeModalOpen(true);
  };

  const resetFilters = () => {
    setFilters({ role: '', organization: '' });
    setSearchTerm('');
    setPage(1);
    setSearchQuery('');
    setRoleFilter('');
    setOrgFilter('');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your organization's employee records
            </p>
          </div>
          <button 
            onClick={openAddModal} 
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 w-full sm:w-auto justify-center"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Employee Modal (Add/Edit) */}
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Add Employee' : 'Edit Employee'}
                </h2>
                <button
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', key: 'firstName', type: 'text' },
                    { label: 'Last Name', key: 'lastName', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    ...(modalMode === 'add' ? [{ label: 'Password', key: 'password', type: 'password' }] : []),
                    { label: 'National ID', key: 'nationalId', type: 'text' },
                    { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
                    { label: 'Position', key: 'position', type: 'text' },
                    { label: 'Employment Date', key: 'employmentDate', type: 'date' },
                    { label: 'Salary', key: 'salary', type: 'number', step: '0.01' },
                    {
                      label: 'Role',
                      key: 'role',
                      type: 'select',
                      options: [
                        { value: '', label: 'Select Role' },
                        { value: 'Manager', label: 'Manager' },
                        { value: 'Employee', label: 'Employee' },
                      ],
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          value={employeeForm[field.key] || ''}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, [field.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all"
                          required={field.key !== 'role' || modalMode === 'add'}
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={employeeForm[field.key] || ''}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, [field.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all"
                          required={modalMode === 'add' || field.key !== 'password'}
                          step={field.step}
                        />
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <select
                      value={employeeForm.organisationId || ''}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, organisationId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all"
                      required
                    >
                      <option value="">Select Organization</option>
                      {organizationsData?.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all shadow-sm order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm order-1 sm:order-2"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                        Saving...
                      </span>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm pl-10"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => {
                  setFilters({ ...filters, role: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm appearance-none pl-4 pr-10"
                aria-label="Filter by role"
              >
                <option value="">All Roles</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={filters.organization}
                onChange={(e) => {
                  setFilters({ ...filters, organization: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm appearance-none pl-4 pr-10"
                aria-label="Filter by organization"
              >
                <option value="">All Organizations</option>
                {organizationsData?.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-all shadow-sm"
              disabled={!searchTerm && !filters.role && !filters.organization}
            >
              <Filter className="w-5 h-5 mr-2" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Records Count */}
        <div className="bg-white rounded-t-xl shadow-md px-4 sm:px-6 py-3 flex justify-between items-center border-b border-gray-200">
          <div className="text-sm text-gray-700 font-medium">
            {isFetching ? (
              <span className="flex items-center">
                <span className="animate-pulse">Updating records...</span>
              </span>
            ) : (
              <span>
                Showing <span className="font-semibold">{employees.length}</span> of{' '}
                <span className="font-semibold">{totalRecords}</span> employees
              </span>
            )}
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong className="font-bold">Error! </strong>
            <span>{error?.data?.message || 'Failed to fetch employees'}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-b-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        )}

        {/* Employee Table */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-b-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{employee.firstName || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{employee.lastName || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.user?.role === 'Manager' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {employee.user?.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{employee.organisation?.name || 'N/A'}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(employee)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50"
                            aria-label="Edit employee"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-50"
                            aria-label="Delete employee"
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                      {searchTerm || filters.role || filters.organization ? (
                        <div>
                          <p className="font-medium">No employees match your filters</p>
                          <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">No employees found</p>
                          <p className="text-sm mt-1">Get started by adding your first employee</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && employeesData && totalPages > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-gray-700 order-2 sm:order-1">
              Page {page} of {totalPages} ({totalRecords} total employees)
            </span>
            <div className="flex items-center gap-3 order-1 sm:order-2">
            <button
  disabled={page === 1 || isFetching}
  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
>
  <ChevronDown className="w-4 h-4 transform rotate-90 mr-1" />
  Previous
</button>
<button
  disabled={page >= totalPages || isFetching}
  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
>
  Next
  <ChevronDown className="w-4 h-4 transform -rotate-90 ml-1" />
</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;