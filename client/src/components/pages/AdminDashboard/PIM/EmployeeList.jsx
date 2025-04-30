import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, RotateCcw, Plus, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDeleteUserMutation } from "../../../../slices/UserApiSlice";
import AddEmployee from "../../AdminDashboard/PIM/AddEmployee";
import { useGetEmployeeQuery, useGetOrganisationEmployeesQuery } from "../../../../slices/employeeSlice";
import { useSelector } from "react-redux";

const EmployeeList = () => {
  const [activeTab, setActiveTab] = useState("Organisation Employee List");
  const [page, setPage] = useState(1);
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id);
  const organisationId = employee?.data.employee.organisationId;

  // Fetch employees
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers, refetch: refetchUsers } = useGetOrganisationEmployeesQuery(organisationId);
  const { data: employeesData, refetch: refetchEmployees } = useGetOrganisationEmployeesQuery(organisationId);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = usersData?.data.employees || [];
  const totalPages = usersData?.totalPages || Math.ceil(users.length / 10);
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
      toast.success("User deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: "bg-green-600 text-white font-medium rounded-lg shadow-lg",
      });
      refetchUsers();
    } catch (error) {
      toast.error(`Failed to delete user: ${error?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: "bg-red-600 text-white font-medium rounded-lg shadow-lg",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4.ConcurrentModificationException sm:p-6 lg:p-8 font-inter">
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
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 py-4">
            {["Organisation Employee List", "Add Employee"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm text-sm sm:text-base ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-50 border border-blue-200"
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
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee List</h2>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
              {isLoadingUsers ? (
                <div className="text-center py-12 text-blue-600 text-lg animate-pulse">
                  Loading employees...
                </div>
              ) : isErrorUsers ? (
                <div className="text-center py-12 text-red-500">
                  Error fetching employees: {isErrorUsers.message}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50">
                  No employees found
                </div>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-blue-50 to-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      {["ID", "Email", "Role", "Position", "Created At"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{header}</span>
                            <ArrowUpDown className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "#F3F4F6" }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{user.id}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{user.user.email}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{user.user.role}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{user.position}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
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
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(page * 10, totalCount)}</span> of{" "}
                  <span className="font-semibold">{totalCount}</span> results
                </p>
                <div className="flex flex-wrap justify-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-all duration-200 shadow-sm disabled:opacity-50"
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
                      className={`px-4 py-2 rounded-lg border border-gray-200 text-sm transition-all duration-200 shadow-sm ${
                        page === pageNum ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePagination(pageNum)}
                    >
                      {pageNum}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-all duration-200 shadow-sm disabled:opacity-50"
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