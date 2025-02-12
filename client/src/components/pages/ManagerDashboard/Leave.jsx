import React, { useState } from "react";

const Leave = () => {
  // Mocked data for leave requests
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: { firstName: "John", lastName: "Doe" },
      type: "Sick Leave",
      startDate: "2025-02-10",
      endDate: "2025-02-15",
      status: "pending",
    },
    {
      id: 2,
      employee: { firstName: "Jane", lastName: "Smith" },
      type: "Vacation",
      startDate: "2025-03-01",
      endDate: "2025-03-07",
      status: "approved",
    },
    {
      id: 3,
      employee: { firstName: "Mark", lastName: "Taylor" },
      type: "Emergency Leave",
      startDate: "2025-02-05",
      endDate: "2025-02-06",
      status: "rejected",
    },
  ]);

  // Placeholder action handlers (no backend logic)
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
      <h1 className="text-2xl font-bold mb-6">Leave Requests</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-4">Employee Name</th>
              <th className="border-b-2 p-4">Leave Type</th>
              <th className="border-b-2 p-4">Start Date</th>
              <th className="border-b-2 p-4">End Date</th>
              <th className="border-b-2 p-4">Status</th>
              <th className="border-b-2 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-100">
                <td className="p-4 border-b">
                  {leave.employee.firstName} {leave.employee.lastName}
                </td>
                <td className="p-4 border-b">{leave.type}</td>
                <td className="p-4 border-b">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="p-4 border-b">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 border-b capitalize">{leave.status}</td>
                <td className="p-4 border-b">
                  {leave.status === "pending" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(leave.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
