import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TimeAtWork = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: 'Feb 16, 2025', clockIn: '9:00 AM', clockOut: '5:00 PM' },
    { date: 'Feb 15, 2025', clockIn: '9:15 AM', clockOut: '5:10 PM' },
    { date: 'Feb 14, 2025', clockIn: '8:55 AM', clockOut: '4:50 PM' },
  ]);
  const [currentClockInTime, setCurrentClockInTime] = useState(null);

  // Simulate checking initial clock-in status (e.g., from local storage or API)
  useEffect(() => {
    // Replace with actual API call to check if user is clocked in
    const storedClockInTime = localStorage.getItem('clockInTime');
    if (storedClockInTime) {
      setIsClockedIn(true);
      setCurrentClockInTime(storedClockInTime);
    }
  }, []);

  // Simulate API call to clock in
  const handleClockIn = async () => {
    try {
      // Replace with actual API call to your backend
      // Example: const response = await fetch('/api/time-attendance/clock-in', { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to clock in');

      const clockInTime = new Date().toLocaleTimeString();
      setIsClockedIn(true);
      setCurrentClockInTime(clockInTime);
      localStorage.setItem('clockInTime', clockInTime); // Simulate storing in DB

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

  // Simulate API call to clock out
  const handleClockOut = async () => {
    try {
      // Replace with actual API call to your backend
      // Example: const response = await fetch('/api/time-attendance/clock-out', { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to clock out');

      const clockOutTime = new Date().toLocaleTimeString();
      setIsClockedIn(false);
      setAttendanceRecords([
        {
          date: new Date().toLocaleDateString(),
          clockIn: currentClockInTime,
          clockOut: clockOutTime,
        },
        ...attendanceRecords,
      ]);
      localStorage.removeItem('clockInTime'); // Simulate removing from DB

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Time at Work</h2>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Clock In/Out</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleClockIn}
            disabled={isClockedIn}
            className={`px-4 py-2 rounded ${
              isClockedIn
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            disabled={!isClockedIn}
            className={`px-4 py-2 rounded ${
              !isClockedIn
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Clock Out
          </button>
        </div>
        {isClockedIn && currentClockInTime && (
          <p className="mt-4 text-green-600">
            Clocked in at: {currentClockInTime}
          </p>
        )}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Recent Attendance</h3>
        <ul>
          {attendanceRecords.map((record, index) => (
            <li key={index}>
              {record.date}: {record.clockIn} - {record.clockOut}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeAtWork;