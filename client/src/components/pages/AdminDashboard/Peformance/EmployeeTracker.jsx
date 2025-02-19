import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, Eye, ArrowUpDown, HelpCircle } from 'lucide-react';

const EmployeePerformanceTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeFilter, setIncludeFilter] = useState('Current Employees Only');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample data
  const [employees] = useState([
    {
      id: 1,
      name: 'manda user',
      tracker: 'Tracker for paul',
      addedDate: '2022-04-08',
      modifiedDate: '2022-04-08',
    },
    // Add more sample data as needed
  ]);

  const filterOptions = [
    'Current Employees Only',
    'All Employees',
    'Former Employees',
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setIncludeFilter('Current Employees Only');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center justify-between">
            Employee Performance Trackers
            <ChevronUp className="h-5 w-5 text-gray-400" />
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Employee Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Type for hints..."
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
                  className="w-full px-4 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{includeFilter}</span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {filterOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setIncludeFilter(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            (1) Record Found
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Employee Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('tracker')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Trackers</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('addedDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Added Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Modified Date</span>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.name}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {employee.tracker}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.addedDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{employee.modifiedDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceTracker;