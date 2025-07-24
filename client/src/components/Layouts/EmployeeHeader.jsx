import { useState } from "react"; // Corrected from "React" to "react"
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../slices/employeeSlice";
import EmployeeSettingsModal from "../pages/EmployeeSettingsModal"; // Adjusted import path

const EmployeeHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);

  const organisationName = orgEmpData?.data.employee.organisation.name?.toUpperCase();
  const employeeName = orgEmpData?.data.employee.firstName;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (option) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    if (option === "Settings") {
      setIsModalOpen(true); // Open the modal for settings
    }
    // Handle other options as needed
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white shadow z-50 h-16">
        {/* Left: Logo/Org Name */}
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow">
            <span className="text-white text-lg font-bold select-none">
              {organisationName ? organisationName[0] : "O"}
            </span>
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight select-none">
            {organisationName || "Unknown Organisation"}
          </span>
        </div>

        {/* Right: User Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow">
              <span className="text-white font-semibold text-base">
                {employeeName ? employeeName[0] : "U"}
              </span>
            </div>
            <span className="font-medium text-gray-700">{employeeName || "Employee"}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-10 border border-gray-100">
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

      {/* Modal Component for Employee Settings */}
      <EmployeeSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default EmployeeHeader;