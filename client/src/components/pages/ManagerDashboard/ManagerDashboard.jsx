import React, { useState, useEffect } from "react";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import ManagerSidebar from "../../Layouts/ManagerSidebar";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import Dashboard from "./Dashboard";
import Leave from "./Leave";
import { useSelector } from "react-redux";
const ManagerDashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard"); // Default to dashboard
  const [showForm, setShowForm] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
 
const {data: orgEmpData} = useGetEmployeeQuery(id)
console.log(orgEmpData, "data needed")

const organisationName = orgEmpData?.data.employee.organisation.name
  const username= "Manager"
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <ManagerSidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Organisation Name Div */}
        <header className="flex justify-between items-center p-4 bg-white shadow rounded-lg mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-700">
              Organisation: {organisationName || "Unknown Organisation"}
            </h1>
          </div>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center text-gray-700 focus:outline-none">
              <span className="mr-2">Hello, {username}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg z-10">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => console.log("Logout")}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Conditional Rendering Based on Section */}
        {currentSection === "dashboard" && <Dashboard />} {/* Dashboard Section */}

        {currentSection === "employees" && (
          <>
            <header className="flex justify-between items-center mb-6">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(true)}
              >
                Add Employee
              </button>
              <input
                type="text"
                placeholder="Search employees..."
                className="p-2 border rounded w-64"
              />
            </header>

            {showForm ? (
              <AddEmployee onClose={() => setShowForm(false)} />
            ) : (
              <EmployeeList />
            )}
          </>
        )}

        {currentSection === "leave" && <Leave />} {/* Leave Section */}
        {currentSection === "reports" && <p>Reports Section</p>}
        {currentSection === "settings" && <p>Settings Section</p>}
      </main>
    </div>
  );
};

export default ManagerDashboard;
