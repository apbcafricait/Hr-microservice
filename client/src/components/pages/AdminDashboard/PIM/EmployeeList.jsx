import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Plus,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetAllEmployeesQuery } from "../../../../slices/employeeSlice";
import { useGetUsersQuery, useDeleteUserMutation } from "../../../../slices/UserApiSlice";
import AddEmployee from "../../AdminDashboard/PIM/AddEmployee";

const EmployeeList = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userId: "",
    role: "",
  });

  const [activeTab, setActiveTab] = useState("System Users");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch system users
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers, refetch: refetchUsers } = useGetUsersQuery({
    page,
    search: searchQuery || undefined,
  });

  // Fetch employees (optional, if you want to keep this tab)
  const { data: employeesData, isLoading: isLoadingEmployees, refetch: refetchEmployees } = useGetAllEmployeesQuery({
    page,
    search: searchQuery || undefined,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = Array.isArray(usersData) ? usersData : [];
  const totalPages = usersData?.totalPages || Math.ceil(users.length / 10); // Adjust if backend provides totalPages
  const totalCount = usersData?.totalCount || users.length;

  const handleSearch = () => {
    setSearchQuery(formData.userName || formData.userId || formData.role);
    setPage(1);
    if (activeTab === "System Users") refetchUsers();
    else refetchEmployees();
  };

  const handleReset = () => {
    setFormData({
      userName: "",
      userId: "",
      role: "",
    });
    setSearchQuery("");
    setPage(1);
    if (activeTab === "System Users") refetchUsers();
    else refetchEmployees();
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (activeTab === "System Users") refetchUsers();
      else refetchEmployees();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      console.log(`User ${id} deleted successfully`);
      toast.success("User deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-green-500 text-white',
      });
      refetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(`Failed to delete user: ${error?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-red-500 text-white',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16 z-50"
      />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-indigo-100 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 py-4">
            {["System Users", "Employee List", "Add Employee"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "System Users" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
          >
            {/* User Information Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">
                  System User Information
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFormVisible(!isFormVisible)}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  {isFormVisible ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                </motion.button>
              </div>

              <AnimatePresence>
                {isFormVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {/* User Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        User Name/Email
                      </label>
                      <input
                        type="text"
                        placeholder="Search by email..."
                        className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData({ ...formData, userName: e.target.value })
                        }
                      />
                    </div>

                    {/* User ID */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        User ID
                      </label>
                      <input
                        type="text"
                        placeholder="Search by ID..."
                        className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm appearance-none"
                        >
                          <option value="">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-semibold"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 font-semibold"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
                Search
              </motion.button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-indigo-100 shadow-sm">
              {isLoadingUsers ? (
                <div className="text-center py-12 text-indigo-600 text-lg animate-pulse">
                  Loading users...
                </div>
              ) : isErrorUsers ? (
                <div className="text-center py-12 text-red-500">
                  Error fetching users: {isErrorUsers.message}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50">
                  No users found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-indigo-300" />
                      </th>
                      {["ID", "Email", "Role", "Active", "Created At", "Actions"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{header}</span>
                            <ArrowUpDown className="h-4 w-4 cursor-pointer hover:text-indigo-500" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100 bg-white">
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "#F9FAFB" }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-indigo-300" />
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.id}</td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{user.role}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-indigo-500 hover:text-indigo-700"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-green-500 hover:text-green-700"
                              title="Edit"
                            >
                              <Edit2 className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(user.id)}
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {(totalPages > 1 || users.length > 0) && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-indigo-700">
                  Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(page * 10, totalCount)}</span> of{" "}
                  <span className="font-semibold">{totalCount}</span> results
                </p>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md"
                    onClick={() => handlePagination(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md ${
                        page === pageNum ? "bg-indigo-600 text-white border-indigo-600" : ""
                      }`}
                      onClick={() => handlePagination(pageNum)}
                    >
                      {pageNum}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md"
                    onClick={() => handlePagination(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ) : activeTab === "Employee List" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
          >
            {/* Employee Information Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-indigo-900 tracking-tight">
                  Employee Information
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFormVisible(!isFormVisible)}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  {isFormVisible ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                </motion.button>
              </div>

              <AnimatePresence>
                {isFormVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {/* Employee Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData({ ...formData, userName: e.target.value })
                        }
                      />
                    </div>

                    {/* Employee ID */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        placeholder="Search by ID..."
                        className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                      />
                    </div>

                    {/* Employment Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-indigo-900">
                        Employment Status
                      </label>
                      <div className="relative">
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm appearance-none"
                        >
                          <option value="">All Statuses</option>
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-semibold"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 font-semibold"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
                Search
              </motion.button>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto rounded-lg border border-indigo-100 shadow-sm">
              {isLoadingEmployees ? (
                <div className="text-center py-12 text-indigo-600 text-lg animate-pulse">
                  Loading employees...
                </div>
              ) : employeesData?.data?.employees?.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50">
                  No employees found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-indigo-300" />
                      </th>
                      {["ID", "First Name", "Last Name", "Email", "Position", "Organization", "Actions"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{header}</span>
                            <ArrowUpDown className="h-4 w-4 cursor-pointer hover:text-indigo-500" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100 bg-white">
                    {employeesData?.data?.employees.map((employee) => (
                      <motion.tr
                        key={employee.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "#F9FAFB" }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-indigo-300" />
                        </td>
                        <td className="px-6 py-4 text-gray-700">{employee.id}</td>
                        <td className="px-6 py-4 text-gray-700">{employee.firstName}</td>
                        <td className="px-6 py-4 text-gray-700">{employee.lastName}</td>
                        <td className="px-6 py-4 text-gray-700">{employee.user?.email || '-'}</td>
                        <td className="px-6 py-4 text-gray-700">{employee.position || '-'}</td>
                        <td className="px-6 py-4 text-gray-700">{employee.organisation?.name || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-indigo-500 hover:text-indigo-700"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-green-500 hover:text-green-700"
                              title="Edit"
                            >
                              <Edit2 className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Employee Pagination */}
            {employeesData?.data?.employees?.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-indigo-700">
                  Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(page * 10, totalCount)}</span> of{" "}
                  <span className="font-semibold">{totalCount}</span> results
                </p>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md"
                    onClick={() => handlePagination(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md ${
                        page === pageNum ? "bg-indigo-600 text-white border-indigo-600" : ""
                      }`}
                      onClick={() => handlePagination(pageNum)}
                    >
                      {pageNum}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md"
                    onClick={() => handlePagination(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddEmployee />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;