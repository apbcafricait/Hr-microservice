// src/components/pages/EmployeeDashboard/Timeatwork.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useClockInMutation, useClockOutMutation } from '../../../slices/attendanceSlice';
import EmployeeHeader from '../../Layouts/EmployeeHeader';

const Timeatwork = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentClockInTime, setCurrentClockInTime] = useState(null);

  const [clockIn] = useClockInMutation();
  const [clockOut] = useClockOutMutation();

  useEffect(() => {
    const storedClockInTime = localStorage.getItem('clockInTime');
    if (storedClockInTime) {
      setIsClockedIn(true);
      setCurrentClockInTime(storedClockInTime);
    }
  }, []);

  const handleClockIn = async () => {
    try {
      const response = await clockIn({
        employeeId: 14, // Replace with actual employee ID
      }).unwrap();

      const clockInTime = new Date(response.attendance.clockIn).toLocaleTimeString();
      setIsClockedIn(true);
      setCurrentClockInTime(clockInTime);
      localStorage.setItem('clockInTime', clockInTime);

      toast.success('Clocked in successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to clock in. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await clockOut({
        employeeId: 14, // Replace with actual employee ID
      }).unwrap();

      const clockOutTime = new Date(response.updatedAttendance.clockOut).toLocaleTimeString();
      setIsClockedIn(false);
      setAttendanceRecords([
        {
          date: new Date().toLocaleDateString(),
          clockIn: currentClockInTime,
          clockOut: clockOutTime,
        },
        ...attendanceRecords,
      ]);
      localStorage.removeItem('clockInTime');

      toast.success('Clocked out successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to clock out. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render the Employee  Header */}
      <EmployeeHeader />
      {/* Main Content with Offset for Fixed Header */}
      <div className="pt-24 p-6 bg-gray-100 rounded-lg shadow-md flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center">Time at Work</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center mb-2">
            <span className={`text-lg font-semibold ${isClockedIn ? 'text-green-500' : 'text-red-500'}`}>
              {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </span>
            <span className="ml-2 text-gray-500">{isClockedIn ? `Clocked In at: ${currentClockInTime}` : ''}</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn}
              className={`px-4 py-2 rounded-full transition duration-300 ${
                isClockedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!isClockedIn}
              className={`px-4 py-2 rounded-full transition duration-300 ${
                !isClockedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Clock Out
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Recent Attendance</h3>
          <ul className="divide-y divide-gray-200">
            {attendanceRecords.map((record, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{record.date}</span>
                <span>{record.clockIn} - {record.clockOut}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Attendance Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeatwork;