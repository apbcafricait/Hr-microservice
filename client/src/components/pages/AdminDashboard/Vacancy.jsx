import React, { useState } from 'react';
import { ChevronDown, Trash2, Edit2 } from 'lucide-react';

const Vacancies = () => {
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [selectedHiringManager, setSelectedHiringManager] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const dummyData = [
    {
      id: 1,
      vacancy: 'Junior Account Assistant',
      jobTitle: 'Account Assistant (Deleted)',
      hiringManager: '(Deleted)',
      status: 'Active'
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Vacancies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Job Title</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Vacancy</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Hiring Manager</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-green-700 bg-white border border-green-700 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  // Reset all filters
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  // Perform search
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-8">
            <button className="mb-4 inline-flex items-center px-4 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              + Add
            </button>

            <div className="text-sm text-gray-600 mb-4">
              (7) Records Found
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-4 p-4">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vacancy
                      <ChevronDown className="inline-block ml-1 h-4 w-4" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                      <ChevronDown className="inline-block ml-1 h-4 w-4" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiring Manager
                      <ChevronDown className="inline-block ml-1 h-4 w-4" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                      <ChevronDown className="inline-block ml-1 h-4 w-4" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="w-4 p-4">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.vacancy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.hiringManager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button className="text-gray-400 hover:text-gray-500">
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-500">
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vacancies;