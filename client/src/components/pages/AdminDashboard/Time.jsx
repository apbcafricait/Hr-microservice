import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { 
  useClockInMutation, 
  useClockOutMutation, 
  useGetAttedanceOfEmployeeQuery 
} from '../../../slices/attendanceSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
const AttendanceSystem = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [activeSection, setActiveSection] = useState('records');
  const [projectView, setProjectView] = useState('projects');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo)
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);
  const employeeId = employee?.data.employee.id;
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [note, setNote] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const [lastPunchTime, setLastPunchTime] = useState(null);
  const [page, setPage] = useState(1);
  const recordsPerPage = 5;

  // API hooks
  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();
  const { data: attendanceRecords, refetch } = useGetAttedanceOfEmployeeQuery(employeeId);

  // Example static data
  const [customers] = useState([
    { id: 1, name: 'ACME Ltd', description: 'Leading apparel manufacturing chain.' },
    { id: 2, name: 'Apache Software Foundation', description: 'Non-profit corporation' },
  ]);
  const [projects] = useState([
    { id: 1, customerName: 'ACME Ltd', project: 'ACME Ltd', projectAdmin: 'John Doe' },
    { id: 2, customerName: 'Apache Software Foundation', project: 'ASF - Phase 1', projectAdmin: 'Jane Smith' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = async () => {
    try {
      if (!isClockedIn) {
        const response = await clockIn({
          employeeId,
          location: "Office"
        }).unwrap();
        setIsClockedIn(true);
        setCurrentAttendanceId(response.attendance.id);
        setLastPunchTime(new Date().toLocaleString());
        setNote('');
        toast.success('Clocked in successfully!');
        refetch();
      } else {
        await clockOut(currentAttendanceId).unwrap();
        setIsClockedIn(false);
        setCurrentAttendanceId(null);
        setLastPunchTime(new Date().toLocaleString());
        setNote('');
        toast.success('Clocked out successfully!');
        refetch();
      }
    } catch (error) {
      toast.error('Operation failed!');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Assuming there's a delete endpoint - adjust URL as needed
      await fetch(`api/time-attendance/${id}`, { method: 'DELETE' });
      toast.success('Record deleted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to delete record!');
      console.error('Error:', error);
    }
  };

  // Pagination
  const paginatedRecords = attendanceRecords?.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );
  const totalPages = Math.ceil((attendanceRecords?.length || 0) / recordsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['attendance', 'projectInfo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-3 border-b-4 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:text-indigo-500 hover:border-indigo-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('Info', ' Info')}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {['records', 'punchInOut'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                    activeSection === section
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {section === 'records' ? 'My Records' : 'Punch In/Out'}
                </button>
              ))}
            </div>

            {activeSection === 'records' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">My Attendance Records</h2>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow">
                      Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        {['Punch In', 'Punch Out', 'Location', 'Duration', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedRecords?.length > 0 ? (
                        paginatedRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">{new Date(record.clockIn).toLocaleString()}</td>
                            <td className="px-6 py-4">{record.clockOut ? new Date(record.clockOut).toLocaleString() : '-'}</td>
                            <td className="px-6 py-4">{record.location}</td>
                            <td className="px-6 py-4">
                              {record.clockOut ? ((new Date(record.clockOut) - new Date(record.clockIn)) / 3600000).toFixed(2) + ' hrs' : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">Page {page} of {totalPages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'punchInOut' && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Punch {isClockedIn ? 'Out' : 'In'}</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={currentTime}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                      />
                    </div>
                  </div>
                  {lastPunchTime && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <p className="text-indigo-700 font-medium">
                        Last {isClockedIn ? 'Punch In' : 'Punch Out'}: {lastPunchTime}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      placeholder="Add any notes here..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handlePunch}
                      disabled={isClockingIn || isClockingOut}
                      className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                        isClockedIn
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } ${(isClockingIn || isClockingOut) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    >
                      {isClockingIn || isClockingOut
                        ? 'Processing...'
                        : isClockedIn
                          ? 'Punch Out'
                          : 'Punch In'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Project Info Section remains largely unchanged */}
        {activeTab === 'projectInfo' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {['projects', 'customers'].map((view) => (
                <button
                  key={view}
                  onClick={() => setProjectView(view)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                    projectView === view
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            {projectView === 'customers' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow">
                    + Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="w-12 px-6 py-3"><input type="checkbox" className="rounded" /></th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                          <td className="px-6 py-4">{customer.name}</td>
                          <td className="px-6 py-4">{customer.description}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-indigo-500 hover:text-indigo-700"><Edit size={18} /></button>
                              <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
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
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {['Customer Name', 'Project', 'Project Admin'].map((placeholder) => (
                      <input
                        key={placeholder}
                        type="text"
                        placeholder={placeholder}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Reset</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Search</button>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="w-12 px-6 py-3"><input type="checkbox" className="rounded" /></th>
                        {['Customer Name', 'Project', 'Project Admin', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                          <td className="px-6 py-4">{project.customerName}</td>
                          <td className="px-6 py-4">{project.project}</td>
                          <td className="px-6 py-4">{project.projectAdmin}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-indigo-500 hover:text-indigo-700"><Edit size={18} /></button>
                              <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
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