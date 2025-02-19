import React, { useState } from "react";

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]); // Empty array initially

  // Placeholder action handlers (no backend logic yet)
  const handleApprove = (id) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: "approved" } : leave
      )
    );
  };

  const handleReject = (id) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: "rejected" } : leave
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto"> {/* Center the content */}
        <h1 className="text-3xl font-bold mb-8 text-center">Leave Requests</h1>
        <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
          <table className="min-w-full text-left border-collapse table-auto"> {/* Added table-auto */}
            <thead className="bg-gray-200"> {/* Added background to header */}
              <tr>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">Employee Name</th>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">Leave Type</th>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">End Date</th>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? ( // Display message if no requests
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition duration-300"> {/* Added transition */}
                    <td className="py-3 px-4 border-b">{leave.employee?.firstName} {leave.employee?.lastName}</td> {/* Optional chaining */}
                    <td className="py-3 px-4 border-b">{leave.type}</td>
                    <td className="py-3 px-4 border-b">{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "-"}</td> {/* Handle empty dates */}
                    <td className="py-3 px-4 border-b">{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "-"}</td> {/* Handle empty dates */}
                    <td className="py-3 px-4 border-b capitalize">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700" // Added yellow for pending
                        }`}
                      >
                        {leave.status || "-"} {/* Display "-" if status is empty */}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b">
                      {leave.status === "pending" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        "-" // Display "-" if not pending
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave;