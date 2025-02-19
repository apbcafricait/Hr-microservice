import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, Plus, ArrowUpDown, HelpCircle } from 'lucide-react';

const EmployeeList = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    employmentStatus: '',
    include: 'Current Employees Only',
    managerName: '',
    jobTitle: '',
    department: '',
  });

  const [activeTab, setActiveTab] = useState('Employee List');
  const [dropdownStates, setDropdownStates] = useState({
    employmentStatus: false,
    include: false,
    jobTitle: false,
    department: false,
  });

  // Sample data for dropdowns
  const employmentStatuses = ['Full-Time', 'Part-Time', 'Contract', 'Temporary'];
  const jobTitles = ['Software Engineer', 'Manager', 'Designer', 'Analyst'];
  const department = ['Engineering', 'Marketing', 'Sales', 'HR'];

  const handleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const [employees] = useState([
    // Sample employee data would go here
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex">
              <button 
                className={`${
                  activeTab === 'Configuration' 
                  ? 'text-gray-700' 
                  : 'text-gray-500'
                } px-3 py-2 flex items-center space-x-1 hover:text-gray-700`}
                onClick={() => setActiveTab('Configuration')}
              >
                <span>Configuration</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {['Employee List', 'Add Employee', 'Reports'].map((tab) => (
                <button
                  key={tab}
                  className={`${
                    activeTab === tab
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-500'
                  } px-3 py-2 hover:text-orange-500`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Employee Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-700">Employee Information</h2>
              <ChevronUp className="h-5 w-5 text-gray-400" />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Employee Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  placeholder="Type for hints..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Employee Id
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                />
              </div>

              {/* Employment Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Employment Status
                </label>
                <div className="relative">
                  <button
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                    onClick={() => handleDropdown('employmentStatus')}
                  >
                    <span className="text-gray-500">-- Select --</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                  {dropdownStates.employmentStatus && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {employmentStatuses.map((status) => (
                        <div
                          key={status}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData({...formData, employmentStatus: status});
                            handleDropdown('employmentStatus');
                          }}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Include */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Include
                </label>
                <div className="relative">
                  <button
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                    onClick={() => handleDropdown('include')}
                  >
                    <span>{formData.include}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Supervisor Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mnaager Name
                </label>
                <input
                  type="text"
                  placeholder="Type for hints..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({...formData, supervisorName: e.target.value})}
                />
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <div className="relative">
                  <button
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                    onClick={() => handleDropdown('jobTitle')}
                  >
                    <span className="text-gray-500">-- Select --</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Sub Unit */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="relative">
                  <button
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                    onClick={() => handleDropdown('subUnit')}
                  >
                    <span className="text-gray-500">-- Select --</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700">
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Add Button */}
          <button className="mb-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors flex items-center space-x-2 text-sm">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>

          {/* Records Count */}
          <div className="text-sm text-gray-600 mb-4">
            (20) Records Found
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-8 px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Id</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>First (& Middle) Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Last Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Job Title</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Employment Status</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Department</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Manager Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Table rows would be mapped here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;