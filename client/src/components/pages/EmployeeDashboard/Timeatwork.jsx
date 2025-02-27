// TimeAtWork.jsx
import React, { useState, useEffect } from "react";
import EmployeeHeader from "../../Layouts/EmployeeHeader";
import { useClockInMutation, useClockOutMutation, useGetAttedanceOfEmployeeQuery } from "../../../slices/attendanceSlice";
import { useSelector } from "react-redux"; // For accessing user info from Redux

const Timeatwork = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockInOn, setIsClockInOn] = useState(false); // State for Clock In toggle
  const [isClockOutOn, setIsClockOutOn] = useState(false); // State for Clock Out toggle
  const [activeAttendanceId, setActiveAttendanceId] = useState(null); // To store the attendance ID for clocking out

  // Redux state for user info
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id; // Assuming userInfo.id is the employee ID

  // Mutations and Queries from attendanceSlice with loading and error states
  const [clockIn, { isLoading: isClockingIn, error: clockInError, isSuccess: clockInSuccess }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut, error: clockOutError, isSuccess: clockOutSuccess }] = useClockOutMutation();
  const { data: attendanceRecords, refetch } = useGetAttedanceOfEmployeeQuery(employeeId);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Toggle functions for Clock In and Clock Out (mutually exclusive)
  const toggleClockIn = async () => {
    if (!isClockInOn && !isClockOutOn) { // Only allow clocking in if neither is active
      if (!employeeId) {
        console.error("No employee ID found in userInfo");
        alert("Please log in to clock in.");
        return;
      }

      console.log("Attempting to clock in with employeeId:", employeeId, "at time:", currentTime.toISOString());
      try {
        const response = await clockIn({
          employeeId: Number(employeeId), // Ensure correct type
          clockInTime: currentTime.toISOString(), // Use current timestamp
          location: "Office A", // You can make this dynamic or fetch from user input
        }).unwrap();
        console.log("Clock in successful, response:", response);
        setIsClockInOn(true);
        setIsClockOutOn(false);
        setActiveAttendanceId(response.id); // Store the attendance ID for clocking out
        refetch(); // Refetch attendance records to update the table
        alert("Clocked in successfully!");
      } catch (error) {
        console.error("Failed to clock in:", error);
        alert(`Failed to clock in: ${error.data?.message || "Unknown error"}`);
      }
    } else {
      console.log("Clock In already active or Clock Out is active, cannot clock in. States:", { isClockInOn, isClockOutOn });
    }
  };

  const toggleClockOut = async () => {
    if (isClockInOn && !isClockOutOn && activeAttendanceId) { // Only allow clocking out if clocked in and have an attendance ID
      console.log("Attempting to clock out with attendanceId:", activeAttendanceId, "at time:", currentTime.toISOString());
      try {
        await clockOut(activeAttendanceId).unwrap();
        console.log("Clock out successful");
        setIsClockOutOn(true);
        setIsClockInOn(false);
        setActiveAttendanceId(null); // Clear the attendance ID after clocking out
        refetch(); // Refetch attendance records to update the table
        alert("Clocked out successfully!");
      } catch (error) {
        console.error("Failed to clock out:", error);
        alert(`Failed to clock out: ${error.data?.message || "Unknown error"}`);
      }
    } else {
      console.log("Cannot clock out: Not clocked in, already clocked out, or no active attendance ID. States:", {
        isClockInOn,
        isClockOutOn,
        activeAttendanceId,
      });
    }
  };

  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Format ISO date/time for display
  const formatIsoDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return {
      time: formatTime(date),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: formatDate(date),
    };
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil((attendanceRecords?.length || 0) / rowsPerPage);
  const paginatedRecords = (attendanceRecords || []).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <EmployeeHeader />
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full flex flex-col items-center">
          {/* Header with Current Time and Date */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-700">{formatTime(currentTime)}</h1>
            <p className="text-gray-500">{formatDate(currentTime)}</p>
          </div>

          {/* Time Slots with Animated Toggles */}
          <div className="w-full space-y-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Clock In</span>
                <button
                  onClick={toggleClockIn}
                  disabled={isClockOutOn || isClockingIn || isClockingOut} // Disable if Clock Out is active or any mutation is loading
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ease-in-out ${
                    isClockInOn ? "bg-blue-500" : "bg-gray-300"
                  } ${(isClockOutOn || isClockingIn || isClockingOut) ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      isClockInOn ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              {clockInError && <p className="text-red-500 text-sm mt-2">Error: {clockInError.data?.message || "Failed to clock in"}</p>}
              {clockInSuccess && <p className="text-green-500 text-sm mt-2">Clocked in successfully!</p>}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Clock Out</span>
                <button
                  onClick={toggleClockOut}
                  disabled={!isClockInOn || isClockOutOn || isClockingIn || isClockingOut} // Disable if not clocked in, already clocked out, or loading
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ease-in-out ${
                    isClockOutOn ? "bg-blue-500" : "bg-gray-300"
                  } ${(!isClockInOn || isClockOutOn || isClockingIn || isClockingOut) ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      isClockOutOn ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              {clockOutError && <p className="text-red-500 text-sm mt-2">Error: {clockOutError.data?.message || "Failed to clock out"}</p>}
              {clockOutSuccess && <p className="text-green-500 text-sm mt-2">Clocked out successfully!</p>}
            </div>
          </div>

          {/* Paginated Attendance Records Table */}
          <div className="w-full bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Attendance Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Clock In Time</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Clock Out Time</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Day</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => {
                      const { time: clockInTime, day, date } = formatIsoDate(record.clockIn);
                      const clockOutTime = record.clockOut ? formatIsoDate(record.clockOut).time : "Not clocked out";
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-600">{clockInTime}</td>
                          <td className="px-6 py-4 text-gray-600">{clockOutTime}</td>
                          <td className="px-6 py-4 text-gray-600">{day}</td>
                          <td className="px-6 py-4 text-gray-600">{date}</td>
                          <td className="px-6 py-4 text-gray-600">{record.location || "Not specified"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors duration-300"
                >
                  Previous
                </button>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition-colors duration-300 ${currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Timeatwork; // Correct export syntax