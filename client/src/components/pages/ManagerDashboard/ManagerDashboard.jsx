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
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  console.log(userInfo, "user info")
  const { data: orgEmpData } = useGetEmployeeQuery(id)
  console.log(orgEmpData, "data needed")

  const organisationName = orgEmpData?.data.employee.organisation.name


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
        <div className="text-center mb-6 p-4 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-700">
            Organisation: {organisationName || "Unknown Organisation"}
          </h1>
        </div>

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
