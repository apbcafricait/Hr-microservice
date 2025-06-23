import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Plus,
  Filter,
  Download,
  Edit2,
  Eye,
  CheckSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEmployee from '../../AdminDashboard/PIM/AddEmployee';
import {
  useGetEmployeeQuery,
  useGetOrganisationEmployeesQuery,
} from '../../../../slices/employeeSlice';
import { useSelector } from 'react-redux';

// Noise background overlay
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-10"
    style={{
      backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0"200"200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.10"/></svg>')`,
    }}
  />
);

const EmployeeList = () => {
  const [activeTab, setActiveTab] = useState('Employees');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    role: '',
    joinedAfter: '',
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const rowsPerPage = 10;

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id, { skip: !id });
  const organisationId = employee?.data.employee.organisationId;
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useGetOrganisationEmployeesQuery(organisationId, { skip: !organisationId });

  const users = usersData?.data?.employees || [];

  // Enhanced filtering and sorting
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Search
    if (searchTerm) {
      const s = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((u) => {
        const fname = u.user?.firstName?.toLowerCase() || '';
        const lname = u.user?.lastName?.toLowerCase() || '';
        const email = u.user?.email?.toLowerCase() || '';
        return fname.includes(s) || lname.includes(s) || email.includes(s);
      });
    }

    // Filters
    if (filters.status) {
      filtered = filtered.filter((u) => u.status === filters.status);
    }
    if (filters.department) {
      filtered = filtered.filter((u) => u.department === filters.department);
    }
    if (filters.role) {
      filtered = filtered.filter((u) => u.user?.role === filters.role);
    }
    if (filters.joinedAfter) {
      filtered = filtered.filter(
        (u) =>
          new Date(u.joinedDate || '9999-12-31') >= new Date(filters.joinedAfter)
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key] || a.user?.[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || b.user?.[sortConfig.key] || '';
        if (sortConfig.key === 'name') {
          aValue = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.toLowerCase();
          bValue = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, sortConfig, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  const totalPages = Math.max(Math.ceil(filteredUsers.length / rowsPerPage), 1);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  }, []);

  const handleExport = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Position', 'Role', 'Department', 'Status'],
      ...filteredUsers.map((u) => [
        u.id,
        `${u.user?.firstName || ''} ${u.user?.lastName || ''}`,
        u.user?.email || 'N/A',
        u.position || 'N/A',
        u.user?.role || 'N/A',
        u.department || 'N/A',
        u.status || 'N/A',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkAction = (action) => {
    if (selectedEmployees.length === 0) {
      toast.warn('Please select at least one employee', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      return;
    }
    // Placeholder for bulk actions
    toast.info(`Performing ${action} on ${selectedEmployees.length} employees`, {
      position: 'top-right',
      autoClose: 3000,
      theme: 'light',
    });
    setSelectedEmployees([]);
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === paginatedUsers.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedUsers.map((u) => u.id));
    }
  };

  // Enhanced glassmorphism
  const glass =
    'backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-100/30 dark:border-gray-800/30 shadow-lg rounded-2xl';

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      <NoiseBG />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Employee Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Streamline your workforce operations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('Add Employee')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base"
          >
            <Plus size={18} />
            Add Employee
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          {['Employees', 'Add Employee'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Employees' ? (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={glass}
            >
              {/* Search and Controls */}
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                      aria-label="Search employees"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                    {selectedEmployees.length > 0 && (
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Bulk Actions
                          <ChevronDown size={16} />
                        </motion.button>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                        >
                          <button
                            onClick={() => handleBulkAction('Update Status')}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => handleBulkAction('Assign Department')}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                          >
                            Assign Department
                          </button>
                        </motion.div>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Toggle filters"
                    >
                      <Filter size={18} className="text-gray-600 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleExport}
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Export data"
                    >
                      <Download size={18} className="text-gray-600 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        aria-label="Filter by status"
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <select
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        aria-label="Filter by department"
                      >
                        <option value="">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">HR</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                      </select>
                      <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        className="p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        aria-label="Filter by role"
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                      </select>
                      <input
                        type="date"
                        value={filters.joinedAfter}
                        onChange={(e) => setFilters({ ...filters, joinedAfter: e.target.value })}
                        className="p-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        aria-label="Filter by join date"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {isLoadingUsers ? (
                  <div className="p-8 text-center text-indigo-600 dark:text-indigo-400 animate-pulse text-sm sm:text-base">
                    Loading employees...
                  </div>
                ) : isErrorUsers ? (
                  <div className="p-8 text-center text-red-500 dark:text-red-400 text-sm sm:text-base">
                    Error loading employees
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    No employees found
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-indigo-50 dark:bg-indigo-900/20 sticky top-0">
                      <tr>
                        <th scope="col" className="px-4 py-3.5 w-12">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.length === paginatedUsers.length}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            aria-label="Select all employees"
                          />
                        </th>
                        {[
                          { key: 'id', label: 'ID' },
                          { key: 'name', label: 'Name' },
                          { key: 'email', label: 'Email' },
                          { key: 'position', label: 'Position' },
                          { key: 'role', label: 'Role' },
                          { key: 'department', label: 'Department' },
                          { key: 'status', label: 'Status' },
                          { key: 'actions', label: 'Actions' },
                        ].map(({ key, label }) => (
                          <th
                            key={key}
                            scope="col"
                            className="px-4 py-3.5 text-left text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider"
                          >
                            <div
                              className={`flex items-center gap-1.5 ${
                                key !== 'actions' ? 'cursor-pointer' : ''
                              }`}
                              onClick={() => key !== 'actions' && handleSort(key)}
                            >
                              {label}
                              {key !== 'actions' && (
                                <ArrowUpDown
                                  className={`h-3.5 w-3.5 transition-transform ${
                                    sortConfig.key === key
                                      ? sortConfig.direction === 'asc'
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                      : 'opacity-50'
                                  }`}
                                />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/50 dark:bg-gray-900/50">
                      <AnimatePresence>
                        {paginatedUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                          >
                            <td className="px-4 py-3.5 w-12">
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(user.id)}
                                onChange={() => toggleEmployeeSelection(user.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                aria-label={`Select employee ${user.user?.firstName} ${user.user?.lastName}`}
                              />
                            </td>
                            <td className="px-4 py-3.5 text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                              {user.id}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                                  {user.user?.firstName?.charAt(0)}
                                  {user.user?.lastName?.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.user?.firstName} {user.user?.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300">
                              {user.user?.email || 'N/A'}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-900 dark:text-gray-200">
                              {user.position || 'N/A'}
                            </td>
                            <td className="px-4 py-3.5 text-sm">
                              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                                {user.user?.role || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-900 dark:text-gray-200">
                              {user.department || 'N/A'}
                            </td>
                            <td className="px-4 py-3.5 text-sm">
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                  user.status === 'Active'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                    : user.status === 'On Leave'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                }`}
                              >
                                {user.status || 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm">
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  title="View Details"
                                  aria-label="View employee details"
                                >
                                  <Eye size={18} className="text-gray-500 dark:text-gray-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  title="Edit Employee"
                                  aria-label="Edit employee"
                                >
                                  <Edit2 size={18} className="text-indigo-500 dark:text-indigo-400" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {filteredUsers.length > rowsPerPage && (
                <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {(page - 1) * rowsPerPage + 1} to{' '}
                    {Math.min(page * rowsPerPage, filteredUsers.length)} of{' '}
                    {filteredUsers.length} employees
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </motion.button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = page - 2 + i;
                      if (page <= 3) pageNum = i + 1;
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            page === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                          } transition-colors`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="add-employee"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={glass}
            >
              <div className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Employee
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Enter details to add a new employee to your organization
                </p>
                <AddEmployee />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeList;