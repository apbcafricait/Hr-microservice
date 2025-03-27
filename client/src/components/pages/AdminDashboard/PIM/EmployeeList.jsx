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
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDeleteUserMutation } from "../../../../slices/UserApiSlice";
import AddEmployee from "../../AdminDashboard/PIM/AddEmployee";
import { useGetEmployeeQuery } from "../../../../slices/employeeSlice";
import { useGetOrganisationEmployeesQuery } from "../../../../slices/employeeSlice";
import { useSelector } from "react-redux";
const EmployeeList = () => {

  const [activeTab, setActiveTab] = useState("Organisation Employee List");
  const [page, setPage] = useState(1);
    const { userInfo } = useSelector((state) => state.auth);
    const id = userInfo?.id;
    const { data: employee } = useGetEmployeeQuery(id);
  const organisationId = employee?.data.employee.organisationId;
  // Fetch system users
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers, refetch: refetchUsers } = useGetOrganisationEmployeesQuery(organisationId);

  // Fetch employees (optional, if you want to keep this tab)
  const { data: employeesData,  refetch: refetchEmployees } = useGetOrganisationEmployeesQuery(organisationId);
  console.log(employeesData)
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = usersData?.data.employees;
  const totalPages = usersData?.totalPages || Math.ceil(users.length / 10); // Adjust if backend provides totalPages
  const totalCount = usersData?.totalCount || users.length;


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
            {["Organisation Employee List",  "Add Employee"].map((tab) => (
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
        {activeTab === "Organisation Employee List" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
          >
            
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
                      {["ID", "Email", "Role","Position", "Created At", "Actions"].map((header) => (
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
                        <td className="px-6 py-4 text-gray-700">{user.user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{user.user.role}</td>
                        <td className="px-6 py-4 text-gray-700">{user.position}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(user.createdAt).toLocaleDateString()}
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