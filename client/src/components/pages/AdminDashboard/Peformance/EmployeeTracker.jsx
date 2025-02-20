import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, RotateCcw, Eye, ArrowUpDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EmployeePerformanceTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [includeFilter, setIncludeFilter] = useState("Current Employees Only");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isExpanded, setIsExpanded] = useState(true);

  // Sample data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Manda User",
      tracker: "Tracker for Paul",
      addedDate: "2022-04-08",
      modifiedDate: "2022-04-08",
    },
    {
      id: 2,
      name: "John Doe",
      tracker: "Tracker for John",
      addedDate: "2022-05-10",
      modifiedDate: "2022-05-12",
    },
    // Add more sample data as needed
  ]);

  const filterOptions = ["Current Employees Only", "All Employees", "Former Employees"];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setEmployees(sortedEmployees);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setIncludeFilter("Current Employees Only");
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between cursor-pointer border-b border-gray-200 pb-4 mb-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Employee Performance Trackers
            </h1>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* Filter Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Dropdown Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Include
                    </label>
                    <div className="relative">
                      <button
                        className="w-full px-4 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span>{includeFilter}</span>
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </button>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                        >
                          {filterOptions.map((option) => (
                            <div
                              key={option}
                              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                              onClick={() => {
                                setIncludeFilter(option);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 text-sm font-medium"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mt-6 mb-4">
            ({filteredEmployees.length}) Record{filteredEmployees.length !== 1 ? "s" : ""} Found
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Employee Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("tracker")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Trackers</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("addedDate")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Added Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Modified Date</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredEmployees.map((employee) => (
                  <motion.tr
                    key={employee.id}
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      {employee.tracker}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.addedDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.modifiedDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Help Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors duration-200"
          >
            <HelpCircle className="h-6 w-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeePerformanceTracker;