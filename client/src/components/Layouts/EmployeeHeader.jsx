import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../slices/employeeSlice";
import { useNavigate } from "react-router-dom";

const EmployeeHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(employeeId);

  const organisationName = orgEmpData?.data.employee.organisation.name?.toUpperCase();
  const employeeName = orgEmpData?.data.employee.firstName;
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (option) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    switch (option) {
      case "Profile":
        navigate("/profile"); // Replace with your profile route
        break;
      case "Settings":
        navigate("/settings"); // Replace with your settings route
        break;
      case "Log Out":
        navigate("/Log Out"); // Replace with your about route
        break;
      case "Change Password":
        navigate("/change-password"); // Replace with your change password route
        break;
      default:
        break;
    }
  };

  return (
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
};

export default EmployeeHeader;
