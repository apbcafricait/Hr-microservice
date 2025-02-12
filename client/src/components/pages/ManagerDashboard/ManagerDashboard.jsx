
import  { useState } from 'react';

const Input = ({ label, type, name, value, onChange, required }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-1 font-bold">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border rounded w-full"
      required={required}
    />
  </div>
);

import React, { useState } from "react";

import ManagerSidebar from "../../Layouts/ManagerSidebar";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import Leave from "./Leave"; // Import the Leave component

const ManagerDashboard = () => {
  const [currentSection, setCurrentSection] = useState("dashboard"); // Default to dashboard
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      
      <ManagerSidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
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

