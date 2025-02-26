import React, { useState, useEffect } from "react";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import ManagerSidebar from "../../Layouts/ManagerSidebar";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import Dashboard from "./Dashboard";
import Leave from "./Leave";
import Payroll from "./Payroll";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = userInfo?.id;

  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const organisationName = orgEmpData?.data.employee.organisation.name?.toUpperCase();

  const managerName = orgEmpData?.data.employee.firstName;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
    console.log("User logged out.");
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
        <header className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-lg sticky top-0 z-20">
          <div className="text-start flex-1">
            <h1 className="text-2xl font-semibold text-gray-700">
              {organisationName || "Unknown Organisation"}
            </h1>
          </div>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center text-gray-700 focus:outline-none">
              <span className="mr-2">Hello, {managerName || "Manager"}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9 l-7 7 l-7 -7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg z-10">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Conditional Rendering Based on Section */}
        {currentSection === "dashboard" && <Dashboard />}

        {currentSection === "employees" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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
        {currentSection === "settings" && <p>Settings Section</p>}
      </main>
    </div>
  );
};

export default ManagerDashboard;