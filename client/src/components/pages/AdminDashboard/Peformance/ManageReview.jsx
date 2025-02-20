import React, { useState } from "react";
import { ChevronDown, Calendar, HelpCircle, Plus, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmployeeTracker from "../Peformance/EmployeeTracker";

const PerformanceReviewPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInclude, setSelectedInclude] = useState("Current Employees Only");
  const [activeTab, setActiveTab] = useState("manageReviews");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReset = () => {
    setSelectedJob("");
    setSelectedStatus("");
    setSelectedInclude("Current Employees Only");
  };

  const handleSearch = () => {
    console.log("Search triggered with filters:", {
      selectedJob,
      selectedStatus,
      selectedInclude,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4"
        >
          <div className="flex space-x-4 md:space-x-6">
            {[
              { id: "manageReviews", label: "Manage Reviews" },
              { id: "employeeTrackers", label: "Employee Trackers" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <HelpCircle className="h-5 w-5 text-gray-400 hover:text-indigo-600" />
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === "manageReviews" ? (
            <motion.div
              key="manageReviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md"
            >
              {/* Header */}
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer border-b border-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Manage Performance Reviews
                </h2>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* Filter Form */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 md:p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Employee Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Type for hints..."
                      />
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <div className="relative">
                        <select
                          value={selectedJob}
                          onChange={(e) => setSelectedJob(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        >
                          <option value="">-- Select --</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="manager">Manager</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Review Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Status
                      </label>
                      <div className="relative">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        >
                          <option value="">-- Select --</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Include */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Include
                      </label>
                      <div className="relative">
                        <select
                          value={selectedInclude}
                          onChange={(e) => setSelectedInclude(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        >
                          <option value="Current Employees Only">Current Employees Only</option>
                          <option value="All Employees">All Employees</option>
                          <option value="Former Employees">Former Employees</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Reviewer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reviewer
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Type for hints..."
                      />
                    </div>

                    {/* From Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          defaultValue="2025-01-01"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          defaultValue="2025-12-31"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Reset
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearch}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Search
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Add Button and Table */}
              <div className="p-4 md:p-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Review</span>
                </motion.button>

                <div className="mt-6">
                  <div className="text-gray-500 text-sm mb-4">No Records Found</div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-8 p-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </th>
                          {[
                            "Employee",
                            "Job Title",
                            "Review Period",
                            "Due Date",
                            "Reviewer",
                            "Review Status",
                            "Actions",
                          ].map((header) => (
                            <th
                              key={header}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {/* Add table rows here when data is available */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employeeTrackers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-4 md:p-6"
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
                Employee Trackers
              </h2>
              <EmployeeTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PerformanceReviewPage;