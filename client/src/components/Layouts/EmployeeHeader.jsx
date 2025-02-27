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
      <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
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
            <span className="mr-2">Hello, {employeeName}</span>
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

      {/* Modal Component for Employee Settings */}
      <EmployeeSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default EmployeeHeader;