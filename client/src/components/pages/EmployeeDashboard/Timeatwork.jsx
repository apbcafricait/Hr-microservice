import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceRecordsQuery,
} from "../../../slices/attendanceSlice";
import EmployeeHeader from "../../Layouts/EmployeeHeader"; // Import the new header component

const Timeatwork = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentClockInTime, setCurrentClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  const { data: attendanceRecords = [], refetch } = useGetAttendanceRecordsQuery(employeeId, {
    skip: !employeeId,
  });

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
    if (!employeeId) {
      toast.error("Employee ID not found.");
      return;
    }
    setLoading(true);
    try {
      const response = await clockIn({ employeeId, location: "Office" }).unwrap();
      const clockInTime = new Date(response.attendance.clockIn).toLocaleTimeString();

      setIsClockedIn(true);
      setCurrentClockInTime(clockInTime);
      localStorage.setItem("clockInTime", clockInTime);

      toast.success("Clocked in successfully!");
      refetch();
    } catch (error) {
      toast.error(
        `Failed to clock in. Error: ${error?.data?.message || error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found.");
      return;
    }
    setLoading(true);
    try {
      const response = await clockOut({ employeeId }).unwrap();
      const clockOutTime = new Date(response.updatedAttendance.clockOut).toLocaleTimeString();

      setIsClockedIn(false);
      setCurrentClockInTime(null);
      localStorage.removeItem("clockInTime");

      toast.success(`Clocked out successfully at ${clockOutTime}!`);
      refetch();
    } catch (error) {
      toast.error(
        `Failed to clock out. Error: ${error?.data?.message || error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <EmployeeHeader /> {/* Use the imported header */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center">Time at Work</h2>
        <div className="flex flex-col items-center mb-6">
          <span
            className={`text-lg font-semibold ${
              isClockedIn ? "text-green-500" : "text-red-500"
            }`}
          >
            {isClockedIn ? "Clocked In" : "Clocked Out"}
          </span>
          <span className="ml-2 text-gray-500">
            {isClockedIn ? `Clocked in at: ${currentClockInTime}` : ""}
          </span>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn || loading}
              className={`px-4 py-2 rounded-full ${
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
              className={`px-4 py-2 rounded-full ${
                !isClockedIn || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Clock Out
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Attendance</h3>
          <ul className="divide-y divide-gray-200">
            {attendanceRecords.map((record, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{record.date}</span>
                <span>{record.clockIn} - {record.clockOut || "N/A"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Timeatwork;