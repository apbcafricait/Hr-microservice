import React, { useState } from "react";
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaRegCalendarAlt, FaClipboardList, FaChartBar, FaMoneyBillWave, FaCog } from "react-icons/fa";

const ManagerSidebar = ({ currentSection, setCurrentSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sections = [
    { name: "Dashboard", id: "dashboard", icon: <FaTachometerAlt className="text-blue-500" /> },
    { name: "Employees", id: "employees", icon: <FaUsers className="text-green-500" /> },
    { name: "Leave", id: "leave", icon: <FaRegCalendarAlt className="text-yellow-500" /> },
    { name: "Recruitment", id: "recruitment", icon: <FaClipboardList className="text-purple-500" /> },
    { name: "Performance", id: "performance", icon: <FaChartBar className="text-red-500" /> },
    { name: "Payroll", id: "payroll", icon: <FaMoneyBillWave className="text-indigo-500" /> },
    { name: "Settings", id: "settings", icon: <FaCog className="text-gray-500" /> },
  ];

  return (
    <aside
      className={`bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} h-screen fixed top-0 left-0`}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex justify-between items-center p-4 shrink-0">
          {!isCollapsed && <h2 className="text-lg font-bold text-white">Manager Dashboard</h2>}
          <button
            className="p-2 rounded focus:outline-none bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        {/* Navigation - Fills remaining space */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2 h-full flex flex-col">
            {sections.map((section) => (
              <li
                key={section.id}
                className={`flex items-center p-2 rounded cursor-pointer transition-colors duration-200 ${
                  currentSection === section.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "hover:bg-gray-50 text-white"
                }`}
                onClick={() => setCurrentSection(section.id)}
                title={isCollapsed ? section.name : ""}
              >
                <span
                  className={`mr-2 ${
                    currentSection === section.id ? "text-white" : "text-gray-300 group-hover:text-purple-600"
                  }`}
                >
                  {section.icon}
                </span>
                {!isCollapsed && <span>{section.name}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
