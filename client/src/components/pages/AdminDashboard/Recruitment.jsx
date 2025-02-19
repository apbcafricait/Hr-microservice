import React, { useState } from 'react';
import { Calendar, Eye, Trash2, Download, ChevronDown, Search, RefreshCw } from 'lucide-react';

const Recruitment = () => {
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [selectedHiringManager, setSelectedHiringManager] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [keywords, setKeywords] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [methodOfApplication, setMethodOfApplication] = useState('');

  const dummyData = [
    {
      id: 1,
      vacancy: 'Senior QA Lead',
      candidate: 'John Doe',
      hiringManager: '(Deleted)',
      applicationDate: '2024-06-02',
      status: 'Shortlisted'
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedJobTitle}
                    onChange={(e) => setSelectedJobTitle(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="qa">Senior QA Lead</option>
                    <option value="dev">Senior Developer</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vacancy</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedVacancy}
                    onChange={(e) => setSelectedVacancy(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Hiring Manager</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                <input
                  type="text"
                  placeholder="Type for hints..."
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Keywords</label>
                <input
                  type="text"
                  placeholder="Enter comma separated words..."
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Method of Application</label>
                <div className="relative">
                  <select 
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={methodOfApplication}
                    onChange={(e) => setMethodOfApplication(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="online">Online</option>
                    <option value="referral">Referral</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date of Application</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    className="rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    className="rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-4 p-4">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vacancy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiring Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.candidate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.hiringManager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.applicationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button className="text-gray-400 hover:text-gray-500">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-500">
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-500">
                            <Download className="h-5 w-5" />
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

export default Recruitment;