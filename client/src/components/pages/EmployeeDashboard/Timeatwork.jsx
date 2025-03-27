import React, { useState, useEffect } from "react";
import EmployeeHeader from "../../Layouts/EmployeeHeader";
import {
  useClockInMutation,
  useClockOutMutation,
  useGetAttedanceOfEmployeeQuery,
} from "../../../slices/attendanceSlice";
import { useSelector } from "react-redux";

const TimeAtWork = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAttendanceId, setActiveAttendanceId] = useState(null);
  const [clockOutMessage, setClockOutMessage] = useState(""); // Added for better feedback

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  const [clockIn, { isLoading: isClockingIn, error: clockInError }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut, error: clockOutError }] = useClockOutMutation();
  const { data: attendanceRecords } = useGetAttedanceOfEmployeeQuery(employeeId);

  // Sync state with backend on load
  useEffect(() => {
    if (attendanceRecords) {
      const activeRecord = attendanceRecords.find((record) => record.clockIn && !record.clockOut);
      if (activeRecord) {
        setIsClockInOn(true);
        setIsClockOutOn(false);
        setActiveAttendanceId(activeRecord.id);
      }
    }
  }, [attendanceRecords]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (attendanceRecords) {
      const sortedRecords = [...attendanceRecords].sort(
        (a, b) => new Date(b.clockIn) - new Date(a.clockIn)
      );
      const latestRecord = sortedRecords[0];
      setActiveAttendanceId(latestRecord?.clockOut ? null : latestRecord?.id);
    }
    return () => clearInterval(timer);
  }, [attendanceRecords]);

  const toggleClockIn = async () => {
    if (!activeAttendanceId) {
      if (!employeeId) {
        alert("Please log in to clock in.");
        return;
      }
      try {
        const response = await clockIn({
          employeeId: Number(employeeId),
          clockInTime: new Date().toISOString(),
          location: "Office A",
        }).unwrap();
        setActiveAttendanceId(response.id);
        alert("Clocked in successfully!");
      } catch (error) {
        alert(`Failed to clock in: ${error.data?.message || "Unknown error"}`);
      }
    }
  };

  const toggleClockOut = async () => {
    if (activeAttendanceId) {
      try {

        await clockOut(activeAttendanceId).unwrap();
        setActiveAttendanceId(null);
        alert("Clocked out successfully!");
      } catch (error) {
        alert(`Failed to clock out: ${error.data?.message || "Unknown error"}`);
      }
    } else {
      alert("You must be clocked in to clock out.");

        const response = await clockOut({
          id: activeAttendanceId,
          clockOutTime: currentTime.toISOString(), // Added clockOutTime
        }).unwrap();
        console.log("Clock out successful, response:", response);
        setIsClockOutOn(true);
        setIsClockInOn(false);
        setActiveAttendanceId(null);
        setClockOutMessage(""); // Clear any error message
        refetch();
        alert("Clocked out successfully!");
      } catch (error) {
        console.error("Failed to clock out:", error);
        setClockOutMessage(`Failed to clock out: ${error.data?.message || "Unknown error"}`);
        alert(`Failed to clock out: ${error.data?.message || "Unknown error"}`);
      }
    } else {
      setClockOutMessage("Cannot clock out: You are not clocked in, already clocked out, or no active attendance record exists.");
      console.log("Cannot clock out: Not clocked in, already clocked out, or no active attendance ID. States:", {
        isClockInOn,
        isClockOutOn,
        activeAttendanceId,
      });

    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  const formatIsoDate = (isoDate) => {
    if (!isoDate) return { time: "", day: "", date: "" };
    const date = new Date(isoDate);
    return {
      time: formatTime(date),
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: formatDate(date),
    };
  };

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
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-blue-600">{formatTime(currentTime)}</h1>
            <p className="text-gray-500">{formatDate(currentTime)}</p>
          </div>

          <div className="w-full space-y-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Clock In</span>
                <button
                  onClick={toggleClockIn}
                  disabled={!!activeAttendanceId || isClockingIn || isClockingOut}
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ease-in-out ${
                    activeAttendanceId ? "bg-blue-500" : "bg-gray-300"
                  } ${(!!activeAttendanceId || isClockingIn || isClockingOut) ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      activeAttendanceId ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              {clockInError && (
                <p className="text-red-500 text-sm mt-2">
                  Error: {clockInError.data?.message || "Failed to clock in"}
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Clock Out</span>
                <button
                  onClick={toggleClockOut}
                  disabled={!activeAttendanceId || isClockingIn || isClockingOut}
                  className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ease-in-out ${
                    !activeAttendanceId ? "bg-gray-300" : "bg-blue-500"
                  } ${(!activeAttendanceId || isClockingIn || isClockingOut) ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      !activeAttendanceId ? "translate-x-0" : "translate-x-6"
                    }`}
                  ></span>
                </button>
              </div>
              {clockOutError && (
                <p className="text-red-500 text-sm mt-2">
                  Error: {clockOutError.data?.message || "Failed to clock out"}
                </p>
              )}

              {clockOutSuccess && (
                <p className="text-green-500 text-sm mt-2">Clocked out successfully!</p>
              )}
              {clockOutMessage && (
                <p className="text-red-500 text-sm mt-2">{clockOutMessage}</p>
              )}
n
            </div>
          </div>

          <div className="w-full bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6">Attendance Records</h2>
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
                      const clockIn = formatIsoDate(record.clockIn);
                      const clockOut = formatIsoDate(record.clockOut);
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-600">{clockIn.time || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-600">{clockOut.time || "Not clocked out"}</td>
                          <td className="px-6 py-4 text-gray-600">{clockIn.day || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-600">{clockIn.date || "N/A"}</td>
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
                      className={`px-3 py-1 rounded-lg transition-colors duration-300 ${
                        currentPage === page
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

export default TimeAtWork;