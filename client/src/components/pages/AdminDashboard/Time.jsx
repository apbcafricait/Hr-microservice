import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Edit, Trash2 } from 'lucide-react';

const AttendanceSystem = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [activeSection, setActiveSection] = useState('records');
  const [projectView, setProjectView] = useState('projects');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [note, setNote] = useState('');

  // Example data
  const [customers] = useState([
    { id: 1, name: 'ACME Ltd', description: 'Leading apparel manufacturing chain.' },
    { id: 2, name: 'Apache Software Foundation', description: 'Non-profit corporation to support Apache software projects' },
  ]);

  const [projects] = useState([
    { id: 1, customerName: 'ACME Ltd', project: 'ACME Ltd', projectAdmin: 'John Doe' },
    { id: 2, customerName: 'Apache Software Foundation', project: 'ASF - Phase 1', projectAdmin: 'Jane Smith' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-3 border-b-2 ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('projectInfo')}
              className={`py-4 px-3 border-b-2 ${
                activeTab === 'projectInfo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Project Info
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveSection('records')}
                className={`px-4 py-2 rounded-md ${
                  activeSection === 'records'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                My Records
              </button>
              <button
                onClick={() => setActiveSection('punchInOut')}
                className={`px-4 py-2 rounded-md ${
                  activeSection === 'punchInOut'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Punch In/Out
              </button>
            </div>

            {activeSection === 'records' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">My Attendance Records</h2>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border rounded-md px-3 py-2"
                    />
                    <button className="ml-4 px-4 py-2 bg-black text-white rounded-md">
                      View
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punch In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punch In Note
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punch Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Punch Out Note
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration (Hours)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceRecords.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === 'punchInOut' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Punch In</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date*
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time*
                      </label>
                      <input
                        type="time"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 h-24"
                      placeholder="Type here"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-black text-white rounded-md">
                      In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projectInfo' && (
          <div className="space-y-6">
            {/* Project Info Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setProjectView('projects')}
                className={`px-4 py-2 rounded-md ${
                  projectView === 'projects'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setProjectView('customers')}
                className={`px-4 py-2 rounded-md ${
                  projectView === 'customers'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Customers
              </button>
            </div>

            {projectView === 'customers' && (
              <div className="bg-white rounded-lg shadow">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-lg font-medium text-gray-900">Customers</h2>
                  <button className="px-4 py-2 bg-black text-white rounded-md flex items-center">
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-6 py-3">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="px-6 py-4">{customer.name}</td>
                          <td className="px-6 py-4">{customer.description}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-gray-500">
                                <Edit size={16} />
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {projectView === 'projects' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      className="border rounded-md px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Project"
                      className="border rounded-md px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Project Admin"
                      className="border rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 border rounded-md">Reset</button>
                    <button className="px-4 py-2 bg-black text-white rounded-md">
                      Search
                    </button>
                  </div>
                </div>
                <div className="p-6 border-t">
                  <button className="px-4 py-2 bg-black text-white rounded-md">
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-6 py-3">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Admin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="px-6 py-4">{project.customerName}</td>
                          <td className="px-6 py-4">{project.project}</td>
                          <td className="px-6 py-4">{project.projectAdmin}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-gray-500">
                                <Edit size={16} />
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;