import React, { useState } from "react";
import { ChevronDown, Trash2, Edit2, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const Vacancies = () => {
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedHiringManager, setSelectedHiringManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const dummyData = [
    {
      id: 1,
      vacancy: "Junior Account Assistant",
      jobTitle: "Account Assistant (Deleted)",
      hiringManager: "(Deleted)",
      status: "Active",
    },
    // Add more dummy data as needed
  ];

  const handleReset = () => {
    setSelectedJobTitle("");
    setSelectedVacancy("");
    setSelectedHiringManager("");
    setSelectedStatus("");
  };

  const handleSearch = () => {
    console.log("Search triggered with filters:", {
      selectedJobTitle,
      selectedVacancy,
      selectedHiringManager,
      selectedStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 md:p-8"
        >
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Vacancies</h2>

          {/* Filter Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="account">Account Assistant</option>
                  <option value="manager">Manager</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Vacancy */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vacancy
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                  value={selectedVacancy}
                  onChange={(e) => setSelectedVacancy(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="junior">Junior Account Assistant</option>
                  <option value="senior">Senior Account Assistant</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Hiring Manager */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hiring Manager
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                  value={selectedHiringManager}
                  onChange={(e) => setSelectedHiringManager(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="manager1">Manager 1</option>
                  <option value="manager2">Manager 2</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </div>

          {/* Table Section */}
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              + Add Vacancy
            </motion.button>

            <div className="text-sm text-gray-600 mb-4">
              ({dummyData.length}) Records Found
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-4 p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    {["Vacancy", "Job Title", "Hiring Manager", "Status", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            {header}
                            {header !== "Actions" && (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dummyData.map((item) => (
                    <motion.tr
                      key={item.id}
                      whileHover={{ backgroundColor: "#F9FAFB" }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="w-4 p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {item.vacancy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.hiringManager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            <Edit2 className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Vacancies;