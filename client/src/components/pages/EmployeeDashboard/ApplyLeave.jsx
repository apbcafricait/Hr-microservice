import { useState, useEffect } from "react";
import { useCreateLeaveRequestMutation } from "../../../slices/leaveApiSlice";
import EmployeeHeader from "../../Layouts/EmployeeHeader";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createLeaveRequest, { isLoading, isError, isSuccess }] = useCreateLeaveRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        employeeId: 8, // Replace this with the actual employee ID
      }).unwrap();
      console.log("Leave request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit leave request:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <EmployeeHeader />
      
      {/* Main Content with Offset for Fixed Header */}
      <div className="pt-24 p-6 flex-1">
        <h2 className="text-2xl font-bold mb-4">Apply Leave</h2>
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Leave Type</label>
              <select
                className="w-full p-2 border rounded"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select leave type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Submit Request
            </button>
          </form>
          {isSuccess && <p className="text-green-500 mt-4">Leave request submitted successfully!</p>}
          {isError && <p className="text-red-500 mt-4">Failed to submit leave request. Please try again.</p>}
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;