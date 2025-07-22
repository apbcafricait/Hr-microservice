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

// Noise background overlay for glassmorphism effect
const NoiseBG = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.10'/%3E%3C/svg%3E")`,
    }}
  />
);

const EmployeeList = () => {
  // State management
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

  // Redux data fetching
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading: isLoadingEmployee } = useGetEmployeeQuery(id, { skip: !id });
  const organisationId = employee?.data?.employee?.organisationId;
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
        (u) => new Date(u.joinedDate || '9999-12-31') >= new Date(filters.joinedAfter)
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

  // Event handlers
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  }, []);

  const handleExport = useCallback(() => {
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
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export successful!', { position: 'top-right', autoClose: 3000 });
  }, [filteredUsers]);

  const handleBulkAction = useCallback((action) => {
    if (selectedEmployees.length === 0) {
      toast.warn('Please select at least one employee', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
      return;
    }
    toast.info(`Performing ${action} on ${selectedEmployees.length} employees`, {
      position: 'top-right',
      autoClose: 3000,
      theme: 'light',
    });
    setSelectedEmployees([]);
  }, [selectedEmployees]);

  const toggleEmployeeSelection = useCallback((id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedEmployees.length === paginatedUsers.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedUsers.map((u) => u.id));
    }
  }, [paginatedUsers, selectedEmployees]);

  // Glassmorphism style
  const glassStyle = `backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-100/20 dark:border-gray-800/20 shadow-2xl rounded-2xl transition-all duration-300`;

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <NoiseBG />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Employee Management
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              Efficiently manage your workforce with advanced tools
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('Add Employee')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm font-semibold"
          >
            <Plus size={20} />
            Add New Employee
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
          {['Employees', 'Add Employee'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={glassStyle}
            >
              {/* Search and Controls */}
              <div className="p-6 border-b border-gray-100/30 dark:border-gray-800/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                      aria-label="Search employees by name or email"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {selectedEmployees.length > 0 && (
                      <div className="relative group">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                          aria-label="Bulk actions menu"
                        >
                          Bulk Actions
                          <ChevronDown size={16} />
                        </motion.button>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 w-56 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          <button
                            onClick={() => handleBulkAction('Update Status')}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-left"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => handleBulkAction('Assign Department')}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-left"
                          >
                            Assign Department
                          </button>
                        </motion.div>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                      aria-label="Toggle advanced filters"
                    >
                      <Filter size={20} className="text-gray-600 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleExport}
                      className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                      aria-label="Export employee data as CSV"
                    >
                      <Download size={20} className="text-gray-600 dark:text-gray-300" />
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
                      transition={{ duration: 0.25 }}
                      className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="p-3 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        aria-label="Filter by employee status"
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <select
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="p-3 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                        className="p-3 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                        className="p-3 text-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        aria-label="Filter by join date"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {isLoadingEmployee || isLoadingUsers ? (
                  <div className="p-10 text-center text-indigo-600 dark:text-indigo-400 animate-pulse text-base">
                    Loading employees...
                  </div>
                ) : isErrorUsers ? (
                  <div className="p-10 text-center text-red-500 dark:text-red-400 text-base">
                    Error loading employees.{' '}
                    <button
                      onClick={refetchUsers}
                      className="underline hover:text-red-600 dark:hover:text-red-300"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 dark:text-gray-400 text-base">
                    No employees found matching your criteria
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    <thead className="bg-indigo-50/50 dark:bg-indigo-900/10 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-4 w-12">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.length === paginatedUsers.length}
                            onChange={toggleSelectAll}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                            className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider"
                          >
                            <div
                              className={`flex items-center gap-2 ${
                                key !== 'actions' ? 'cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100' : ''
                              }`}
                              onClick={() => key !== 'actions' && handleSort(key)}
                            >
                              {label}
                              {key !== 'actions' && (
                                <ArrowUpDown
                                  className={`h-4 w-4 transition-transform ${
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
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50 bg-white/30 dark:bg-gray-900/30">
                      <AnimatePresence>
                        {paginatedUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 w-12">
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(user.id)}
                                onChange={() => toggleEmployeeSelection(user.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                aria-label={`Select employee ${user.user?.firstName} ${user.user?.lastName}`}
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                              {user.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                                  {user.user?.firstName?.charAt(0)}
                                  {user.user?.lastName?.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.user?.firstName} {user.user?.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                              {user.user?.email || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                              {user.position || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                                {user.user?.role || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                              {user.department || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  user.status === 'Active'
                                    ? 'bg-green-100/50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                    : user.status === 'On Leave'
                                    ? 'bg-yellow-100/50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-red-100/50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                }`}
                              >
                                {user.status || 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                                  title="View employee details"
                                  aria-label="View employee details"
                                >
                                  <Eye size={18} className="text-gray-500 dark:text-gray-400" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                                  title="Edit employee"
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
                <div className="p-6 border-t border-gray-100/30 dark:border-gray-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                      className="px-5 py-2 text-sm font-medium rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
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
                          className={`px-5 py-2 text-sm font-medium rounded-xl ${
                            page === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                          } transition-colors`}
                          aria-label={`Go to page ${pageNum}`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="px-5 py-2 text-sm font-medium rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={glassStyle}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Add New Employee
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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