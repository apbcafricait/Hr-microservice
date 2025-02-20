import React, { useState } from "react";
import { useGetAllLeaveRequestsQuery, useUpdateLeaveRequestMutation } from "../../../slices/leaveApiSlice"; // Import API hooks
import { useSelector } from "react-redux";
const Leave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch leave requests using RTK Query
  const { data, error, isLoading } = useGetAllLeaveRequestsQuery({ page: currentPage, limit });
  const { userInfo } = useSelector((state) => state.auth);
  const userId = parseInt(userInfo?.id);
  const leaveRequests = data?.data?.leaveRequests || []; // Ensure data is always an array
  const totalPages = data?.data?.pagination?.pages || 1;


  // Mutation hook for updating leave requests
  const [updateLeaveRequest] = useUpdateLeaveRequestMutation();

  // Approve leave request function
  const handleApprove = async (id) => {
    const body = {
    status: "approved",
      approvedBy: userId
    }
    console.log(body, "body being sent")
    try {
   
      const res = await updateLeaveRequest({id ,body}).unwrap();
      console.log(`Leave request approved:`, res);
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  // Placeholder Reject function (only updates UI)
  const handleReject = (id) => {
    console.log(`Rejecting leave request ${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Leave Requests</h1>

        {/* Handle Loading and Errors */}
        {isLoading && <p className="text-center text-gray-500">Loading leave requests...</p>}
        {error && <p className="text-center text-red-500">Failed to load leave requests.</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto bg-white shadow rounded-lg p-6">
            <table className="min-w-full text-left border-collapse table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">Employee Name</th>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">Leave Type</th>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">Start Date</th>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">End Date</th>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((leave, index) => (
                    <tr
                      key={leave.id}
                      className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                    >
                      <td className="py-3 px-4 border-b">
                        {leave.employee?.firstName} {leave.employee?.lastName}
                      </td>
                      <td className="py-3 px-4 border-b">{leave.type}</td>
                      <td className="py-3 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 border-b">{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 border-b capitalize">
                        <span
                          className={`px-3 py-1 rounded text-sm ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        {leave.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leave;
