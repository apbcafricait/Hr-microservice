import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceRecordsQuery,
} from "../../../slices/attendanceSlice";
import { useSelector } from "react-redux"; // Assuming you use Redux for user info

const TimeAtWork = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentClockInTime, setCurrentClockInTime] = useState(null);
  const [loading, setLoading] = useState(false); // Add this line

  const { userInfo } = useSelector((state) => state.auth); // Get user info
  const employeeId = userInfo?.id; // Use the dynamic ID from Redux state

  const { data: attendanceRecords = [], refetch } = useGetAttendanceRecordsQuery(employeeId);

  const [clockIn] = useClockInMutation();
  const [clockOut] = useClockOutMutation();

  useEffect(() => {
    const storedClockInTime = localStorage.getItem("clockInTime");
    if (storedClockInTime) {
      setIsClockedIn(true);
      setCurrentClockInTime(storedClockInTime);
    }
  }, []);

  const handleClockIn = async () => {
    setLoading(true); // Start loading
    try {
      console.log("Clocking in...");
      const response = await clockIn({ employeeId, location: "Office" }).unwrap();
  
      if (!response || !response.attendance || !response.attendance.clockIn) {
        throw new Error("Invalid response from the server");
      }
  
      const clockInTime = new Date(response.attendance.clockIn).toLocaleTimeString();
      setIsClockedIn(true);
      setCurrentClockInTime(clockInTime);
      localStorage.setItem("clockInTime", clockInTime);
  
      toast.success("Clocked in successfully!", { position: "top-right", autoClose: 3000 });
      refetch(); // Refresh the attendance records
    } catch (error) {
      console.error("Clock-in error:", error);
      toast.error(
        `Failed to clock in. Error: ${error?.data?.message || error.message || "Unknown error"}`,
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  

  const handleClockOut = async () => {
    setLoading(true); // Start loading
    try {
      console.log("Clocking out...");
      const response = await clockOut({ employeeId }).unwrap();
  
      const clockOutTime = new Date(response.updatedAttendance.clockOut).toLocaleTimeString();
      setIsClockedIn(false);
      setCurrentClockInTime(null);
      localStorage.removeItem("clockInTime");
  
      toast.success(`Clocked out successfully at ${clockOutTime}!`, {
        position: "top-right",
        autoClose: 3000,
      });
      refetch(); // Refresh the attendance records
    } catch (error) {
      // Use the error object here
      console.error("Clock-out error:", error); // Log the error for debugging
      toast.error(
        `Failed to clock out. Error: ${error?.data?.message || error.message || "Unknown error"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false); // Stop loading
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
            disabled={isClockedIn || loading}
            className={`px-4 py-2 rounded ${
              isClockedIn || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            disabled={!isClockedIn || loading}
            className={`px-4 py-2 rounded ${
              !isClockedIn || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Clock Out
          </button>
        </div>
        {isClockedIn && currentClockInTime && (
          <p className="mt-4 text-green-600">Clocked in at: {currentClockInTime}</p>
        )}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Recent Attendance</h3>
        <ul>
          {attendanceRecords.map((record, index) => (
            <li key={index}>
              {record.date}: {record.clockIn} - {record.clockOut || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeAtWork;
