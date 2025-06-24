import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Edit, Trash2, Download } from 'lucide-react';
import { 
  useClockInMutation, 
  useClockOutMutation, 
  useGetAttedanceOfEmployeeQuery 
} from '../../../slices/attendanceSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { CSVLink } from 'react-csv';

// Utility function to convert records to CSV format
const prepareCSVData = (records) => {
  return records?.map(record => ({
    'Punch In': new Date(record.clockIn).toLocaleString(),
    'Punch Out': record.clockOut ? new Date(record.clockOut).toLocaleString() : '-',
    Location: record.location,
    Duration: record.clockOut ? ((new Date(record.clockOut) - new Date(record.clockIn)) / 3600000).toFixed(2) + ' hrs' : '-'
  })) || [];
};

const AttendanceSystem = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [activeSection, setActiveSection] = useState('records');
  const [projectView, setProjectView] = useState('projects');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { userInfo } = useSelector((state) => state.auth);
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

  // Static data
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Lato:wght@400;500&display=swap');
        body {
          font-family: 'Lato', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 py-4">
            {['attendance', 'projectInfo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-poppins font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
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
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {['records', 'punchInOut'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-6 py-2 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 backdrop-blur-sm ${
                    activeSection === section
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/70 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {section === 'records' ? 'My Records' : 'Punch In/Out'}
                </button>
              ))}
            </div>

            {activeSection === 'records' && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-poppins font-bold text-gray-900">My Attendance Records</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-gray-200 rounded-lg px-4 py-2 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
                      <Calendar size={16} /> Filter
                    </button>
                    <CSVLink
                      data={prepareCSVData(attendanceRecords)}
                      filename={`attendance-records-${selectedDate}.csv`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                    >
                      <Download size={16} /> Export CSV
                    </CSVLink>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-100">
                    <thead className="bg-indigo-50/50 backdrop-blur-sm">
                      <tr>
                        {['Punch In', 'Punch Out', 'Location', 'Duration', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-poppins font-semibold text-indigo-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedRecords?.length > 0 ? (
                        paginatedRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4 text-sm">{new Date(record.clockIn).toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">{record.clockOut ? new Date(record.clockOut).toLocaleString() : '-'}</td>
                            <td className="px-6 py-4 text-sm">{record.location}</td>
                            <td className="px-6 py-4 text-sm">
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
                  <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'punchInOut' && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
                <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">Punch {isClockedIn ? 'Out' : 'In'}</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="date"
                          value={selectedDate}
                          disabled
                          className="w-full pl-10 border border-gray-200 rounded-lg px-4 py-2 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="time"
                          value={currentTime}
                          disabled
                          className="w-full pl-10 border border-gray-200 rounded-lg px-4 py-2 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {lastPunchTime && (
                    <div className="bg-indigo-100/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-200/30">
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
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 h-24 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      placeholder="Add any notes here..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handlePunch}
                      disabled={isClockingIn || isClockingOut}
                      className={`px-6 py-3 rounded-xl text-white font-poppins font-semibold transition-all duration-300 shadow-lg ${
                        isClockedIn
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } ${(isClockingIn || isClockingOut) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5'}`}
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

        {activeTab === 'projectInfo' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {['projects', 'customers'].map((view) => (
                <button
                  key={view}
                  onClick={() => setProjectView(view)}
                  className={`px-6 py-2 rounded-xl font-poppins font-semibold text-sm transition-all duration-300 backdrop-blur-sm ${
                    projectView === view
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/70 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>

            {projectView === 'customers' && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-poppins font-bold text-gray-900">Customers</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
                    <span>+ Add</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-100">
                    <thead className="bg-indigo-50/50 backdrop-blur-sm">
                      <tr>
                        <th className="w-12 px-6 py-3"><input type="checkbox" className="rounded border-gray-200" /></th>
                        <th className="px-6 py-3 text-left text-xs font-poppins font-semibold text-indigo-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-poppins font-semibold text-indigo-700 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-poppins font-semibold text-indigo-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-indigo-50/30">
                          <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-200" /></td>
                          <td className="px-6 py-4 text-sm">{customer.name}</td>
                          <td className="px-6 py-4 text-sm">{customer.description}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-3">
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
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30">
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {['Customer Name', 'Project', 'Project Admin'].map((placeholder) => (
                      <input
                        key={placeholder}
                        type="text"
                        placeholder={placeholder}
                        className="border border-gray-200 rounded-lg px-4 py-2 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white/50 hover:bg-gray-100">Reset</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">Search</button>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">+ Add</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-100">
                    <thead className="bg-indigo-50/50 backdrop-blur-sm">
                      <tr>
                        <th className="w-12 px-6 py-3"><input type="checkbox" className="rounded border-gray-200" /></th>
                        {['Customer Name', 'Project', 'Project Admin', 'Actions'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-poppins font-semibold text-indigo-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-indigo-50/30">
                          <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-200" /></td>
                          <td className="px-6 py-4 text-sm">{project.customerName}</td>
                          <td className="px-6 py-4 text-sm">{project.project}</td>
                          <td className="px-6 py-4 text-sm">{project.projectAdmin}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-3">
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