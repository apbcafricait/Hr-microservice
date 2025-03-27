import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, ChevronDown, Edit, Trash, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeQuery,
  useGetOrganisationEmployeesQuery
} from '../../../slices/employeeSlice';
import { useGetOrganisationByIdQuery } from '../../../slices/organizationSlice';
import { toast } from 'react-toastify';

const UserManagement = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: '' });
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
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
  });

  // Get logged-in admin's organization details
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id);
  const organisationId = employee?.data.employee.organisationId;
  const { data: organisation } = useGetOrganisationByIdQuery(organisationId);
  const organisationName = organisation?.data?.organisation.name;

  // API Hooks
  const {
    data: employeesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOrganisationEmployeesQuery(organisationId);

  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
      setRoleFilter(filters.role);
    }, 500);
  
    return () => clearTimeout(timer);
  }, [searchTerm, filters.role]);

  // Calculate total pages for pagination
  const totalRecords = employeesData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Memoize the employee data
  const employees = useMemo(() => {
    return employeesData?.data?.employees || [];
  }, [employeesData]);

  // Handlers
  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId).unwrap();
        refetch();
        toast.success('Employee deleted successfully!');
      } catch (err) {
        toast.error(`Failed to delete employee: ${err?.data?.message || 'Unknown error'}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...employeeForm,
        salary: parseFloat(employeeForm.salary),
        organisationId: organisationId, // Automatically set organization ID
      };

      if (modalMode === 'add') {
        await createEmployee(employeeData).unwrap();
        toast.success('Employee added successfully!');
      } else {
        await updateEmployee({
          id: selectedEmployee.id,
          body: employeeData,
        }).unwrap();
        toast.success('Employee updated successfully!');
      }
      setIsEmployeeModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error(`Failed to save employee: ${err?.data?.message || 'Unknown error'}`);
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
    });
    setIsEmployeeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Employees - {organisationName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your organization's employee records
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 w-full sm:w-auto justify-center"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Employee Modal */}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={employeeForm[field.key] || ''}
                          onChange={(e) => setEmployeeForm({ ...employeeForm, [field.key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                          required={modalMode === 'add' || field.key !== 'password'}
                          step={field.step}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong className="font-bold">Error! </strong>
            <span>{error?.data?.message || 'Failed to fetch employees'}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        )}

        {/* Employee Table */}
        {!isLoading && !isError && (
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.firstName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.lastName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.user?.role === 'Manager'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {employee.user?.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{employee.position || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(employee)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            disabled={isDeleting}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <p className="font-medium">No employees found</p>
                      <p className="text-sm mt-1">Get started by adding your first employee</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-3">
              <button
                disabled={page === 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50"
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