import { useState } from "react";
import { useCreateLeaveRequestMutation, useGetAllLeaveRequestsQuery } from "../../../slices/leaveApiSlice";
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import EmployeeHeader from "../../Layouts/EmployeeHeader";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [createLeaveRequest, { isLoading, isError, isSuccess }] = useCreateLeaveRequestMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const employeeId = orgEmpData?.data.employee.id;
  const organisationId = orgEmpData?.data.employee.organisation.id;

  const { data: leaveRequests } = useGetAllLeaveRequestsQuery(employeeId);

  // Default to an empty array if leaveRequests or leaveRequests.data is undefined
  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.filter(
    (request) => request.employeeId === employeeId
  ) || [];

  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalLeaveRequests.length / rowsPerPage);
  const paginatedLeaves = totalLeaveRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        employeeId,
      }).unwrap();
      setLeaveType("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Failed to submit leave request:", error);
    }
  };

  // Helper function to format ISO dates to "YYYY-MM-DD"
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50  p-6">
      <EmployeeHeader />
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {/* Enhanced Leave Application Form */}
        <section className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Your Leave
            </h2>
            <p className="text-indigo-100 mt-1 text-sm">Plan your time off effortlessly</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
              <div className="relative">
                <select
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out appearance-none bg-white hover:border-indigo-400"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select leave type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="other">Other</option>
                </select>
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span>{isLoading ? "Submitting..." : "Submit Request"}</span>
            </button>
            {isSuccess && (
              <p className="text-green-600 text-center mt-4 bg-green-50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Leave request submitted successfully!
              </p>
            )}
            {isError && (
              <p className="text-red-600 text-center mt-4 bg-red-50 p-2 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Failed to submit leave request. Please try again.
              </p>
            )}
          </form>
        </section>

        {/* Paginated Past Leaves Table */}
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Past Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Leave Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Start Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">End Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.length > 0 ? (
                  paginatedLeaves.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-600">{leave.type}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(leave.startDate)}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(leave.endDate)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${leave.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No leave requests found.
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
        </section>
      </main>
    </div>
  );
};

export default ApplyLeave;