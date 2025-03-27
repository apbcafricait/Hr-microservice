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

const ManagerDashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard");

  const [showForm, setShowForm] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false); // New state for modal
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
      {/* Sidebar - Fixed Position */}
      <div className="fixed top-0 left-0 h-screen bg-white shadow-md z-10">
        <ManagerSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      </div>

      {/* Main Content - Pushes Sidebar */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto h-screen">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 shadow rounded-lg sticky top-0 z-20">
          <div className="text-start flex-1">
            <h1 className="text-2xl font-semibold text-white">
              {organisationName || "Unknown Organisation"}
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white focus:outline-none hover:bg-opacity-80 transition duration-200 px-2 py-1 rounded"
            >
              <span className="mr-2">{getTimeBasedGreeting()}, {managerName || "Manager"}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9 l-7 7 l-7 -7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out transform origin-top">
                <button
                  onClick={handleProfileClick} // Trigger modal
                  className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full text-left transition duration-200"
                >
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full text-left transition duration-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Profile</h2>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-gray-700">
                <p><strong>Name:</strong> {managerName || "N/A"}</p>
                <p><strong>Organisation:</strong> {organisationName || "N/A"}</p>
                <p><strong>National ID:</strong> {nationalId || "N/A"}</p>
                <p><strong>Email:</strong> {useremail || "N/A"}</p>
                {/* Add more profile details as needed */}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeProfileModal}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conditional Rendering Based on Section */}
        {currentSection === "dashboard" && <Dashboard />}
        {currentSection === "employees" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded"
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