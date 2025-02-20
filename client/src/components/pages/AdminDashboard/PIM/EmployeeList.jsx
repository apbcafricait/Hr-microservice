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
import { useGetAllEmployeesQuery } from "../../../../slices/employeeSlice"; // Adjust path as needed
import AddEmployee from "../../AdminDashboard/PIM/AddEmployee";

const EmployeeList = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    employmentStatus: "",
    include: "Current Employees Only",
    managerName: "",
    jobTitle: "",
    department: "",
  });

  const [activeTab, setActiveTab] = useState("Employee List");
  const [dropdownStates, setDropdownStates] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: employeesData, isLoading, isError } = useGetAllEmployeesQuery({
    page,
    searchQuery,
  });

  const handleDropdown = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      employmentStatus: "",
      include: "Current Employees Only",
      managerName: "",
      jobTitle: "",
      department: "",
    });
    setSearchQuery("");
    setPage(1);
  };

  const handlePagination = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return <div className="text-center py-10 text-red-500">Error fetching data</div>;

  const employees = Array.isArray(employeesData?.data) ? employeesData.data : [];
  const totalPages = employeesData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16 space-x-6">
            {["Employee List", "Add Employee"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
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
        {activeTab === "Employee List" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            {/* Employee Information Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Employee Information
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFormVisible(!isFormVisible)}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  {isFormVisible ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {isFormVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {/* Employee Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        placeholder="Type for hints..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={formData.employeeName}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeName: e.target.value })
                        }
                      />
                    </div>

                    {/* Employee ID */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Employee Id
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeId: e.target.value })
                        }
                      />
                    </div>

                    {/* Employment Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Employment Status
                      </label>
                      <div className="relative">
                        <button
                          className="w-full px-4 py-2 text-left rounded-md border border-gray-300 bg-white text-gray-500 focus:ring-2 focus:ring-indigo-500 flex items-center justify-between transition-all duration-200"
                          onClick={() => handleDropdown("employmentStatus")}
                        >
                          <span>
                            {formData.employmentStatus || "-- Select --"}
                          </span>
                          <ChevronDown className="h-5 w-5" />
                        </button>
                        {dropdownStates.employmentStatus && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 rounded-md shadow-lg bg-white border border-gray-300"
                          >
                            {[
                              "Full-Time",
                              "Part-Time",
                              "Contract",
                              "Temporary",
                            ].map((status) => (
                              <div
                                key={status}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-gray-700"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    employmentStatus: status,
                                  });
                                  handleDropdown("employmentStatus");
                                }}
                              >
                                {status}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </motion.button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </th>
                    {[
                      "Id",
                      "First Name",
                      "Last Name",
                      "Email",
                      "Position",
                      "Organization",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "#F9FAFB" }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-600">{employee.id}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.firstName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.user.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {employee.organisation.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          {[
                            { icon: Eye, color: "text-indigo-500 hover:text-indigo-700" },
                            { icon: Edit2, color: "text-green-500 hover:text-green-700" },
                            { icon: Trash2, color: "text-red-500 hover:text-red-700" },
                          ].map(({ icon: Icon, color }, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={color}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{employees.length}</span> of{" "}
                <span className="font-medium">{employeesData?.totalCount}</span>{" "}
                results
              </p>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  onClick={() => handlePagination(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </motion.button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 ${
                        page === pageNum ? "bg-indigo-600 text-white" : "bg-white"
                      }`}
                      onClick={() => handlePagination(pageNum)}
                    >
                      {pageNum}
                    </motion.button>
                  )
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  onClick={() => handlePagination(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </motion.button>
              </div>
            </div>
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