import { useState } from "react";
import { useCreateLeaveRequestMutation } from "../../../slices/leaveApiSlice";
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { useNavigate } from "react-router-dom";

const ApplyLeave = ({ hideHeader = false }) => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [createLeaveRequest, { isLoading, isError, isSuccess }] = useCreateLeaveRequestMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);

  const organisationName = orgEmpData?.data.employee.organisation.name?.toUpperCase();
  const employeeName = orgEmpData?.data.employee.firstName;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        employeeId: id || 8, // Use dynamic employee ID from userInfo, fallback to 8
      }).unwrap();
      console.log("Leave request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit leave request:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (option) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    switch (option) {
      case "Profile":
        navigate("/employee/profile"); // Match EmployeeDashboard behavior
        break;
      case "Settings":
        navigate("/settings"); // Match EmployeeDashboard route
        break;
      case "About":
        navigate("/about"); // Match EmployeeDashboard route
        break;
      case "Change Password":
        navigate("/change-password"); // Match EmployeeDashboard route
        break;
      default:
        break;
    }
  };

  const renderHeader = () => (
    <header className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-lg">
      <div className="text-start flex-1">
        <h1 className="text-2xl font-semibold text-gray-700">
          {organisationName || "Unknown Organisation"}
        </h1>
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 focus:outline-none"
        >
          <span className="mr-2">Hello, {employeeName || "Employee"}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9 l-7 7 l-7 -7"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <ul className="py-1">
              {["Profile", "Settings", "About", "Change Password"].map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleMenuClick(option)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!hideHeader && renderHeader()}
      <div className="p-6 flex-1">
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
          {isSuccess && (
            <p className="text-green-500 mt-4">Leave request submitted successfully!</p>
          )}
          {isError && (
            <p className="text-red-500 mt-4">Failed to submit leave request. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;