import React, { useState, useEffect } from "react";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import ManagerSidebar from "../../Layouts/ManagerSidebar";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import Dashboard from "./Dashboard";
import Leave from "./Leave";
import Payroll from "./Payroll";
import Claim from "./Claim";
import ManageReview from "../AdminDashboard/Peformance/ManageReview";
import Recruitment from "../AdminDashboard/Recruitment";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = ({  }) => {
  const [currentSection, setCurrentSection] = useState("dashboard");

  const [showForm, setShowForm] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false); // New state for modal
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = userInfo?.id;

  const { data: orgEmpData } = useGetEmployeeQuery(id);
  console.log(orgEmpData);
  const organisationName = orgEmpData?.data.employee.organisation.name?.toUpperCase();
  const managerName = orgEmpData?.data.employee.firstName;
  const nationalId = orgEmpData?.data.employee.nationalId;
  const useremail = orgEmpData?.data.employee.user.email;


  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
    console.log("User logged out.");
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true); // Open modal
    setDropdownOpen(false); // Close dropdown
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false); // Close modal
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/"); // Adjust the path to your landing page
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Responsive */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-md z-10 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}
      >
        <ManagerSidebar 
  isSidebarOpen={isSidebarOpen} 
  toggleSidebar={toggleSidebar} 
  currentSection={currentSection} 
  setCurrentSection={setCurrentSection} 
/>
      </div>
  
      {/* Toggle Button for Sidebar (Mobile) */}
     <button
  onClick={toggleSidebar} // Now toggleSidebar is defined
  className="absolute top-4 left-4 md:hidden bg-purple-600 text-white p-2 rounded-md"
>
  ☰
</button>

  
      {/* Main Content - Adjusting for Sidebar */}
      <main className={`flex-1 p-6 overflow-y-auto h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 shadow rounded-lg sticky top-0 z-20">
          <div className="text-start flex-1">
            <h1 className="text-lg sm:text-2xl font-semibold text-white">
              {organisationName || "Unknown Organisation"}
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white focus:outline-none hover:bg-opacity-80 transition duration-200 px-2 py-1 rounded"
            >
              <span className="mr-2 text-sm sm:text-base">{getTimeBasedGreeting()}, {managerName || "Manager"}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9 l-7 7 l-7 -7" />
              </svg>
            </button>
            <div className="relative inline-block text-left">
      {/* Trigger to toggle dropdown */}
      {/* <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Open Menu
      </button> */}

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out transform origin-top">
          <button
            onClick={handleProfileClick}
            className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full text-left transition duration-200"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full text-left transition duration-200"
          >
            Logout
          </button>
        </div>
      )}

      {/* Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <p className="mb-2"><strong>National ID:</strong> {nationalId || 'N/A'}</p>
            <p className="mb-4"><strong>Email:</strong> {useremail || 'N/A'}</p>
            <button
              onClick={closeProfileModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
          </div>
        </header>
  
        {/* Conditional Rendering Based on Section */}
        {currentSection === "dashboard" && <Dashboard />}
        {currentSection === "employees" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded w-full sm:w-auto"
                onClick={() => setShowForm(true)}
              >
                Add Employee
              </button>
            </header>
            {showForm ? (
              <AddEmployee onClose={() => setShowForm(false)} />
            ) : (
              <EmployeeList />
            )}
          </>
        )}
        {currentSection === "leave" && <Leave />}
        {currentSection === "reports" && <p>Reports Section</p>}
        {currentSection === "payroll" && <Payroll />}
        {currentSection === "claims" && <Claim />}
       {currentSection === "settings" && <p>Settings Section</p>}
        {currentSection === "performance" && <ManageReview />}
        {currentSection === "recruitment" && <Recruitment />}
      </main>
    </div>
  );
  
};

export default ManagerDashboard;