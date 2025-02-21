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
      className={`bg-white shadow-lg p-4 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} hidden md:block`}
    >
      <div className="flex justify-between items-center">
        {!isCollapsed && <h2 className="text-lg font-bold text-gray-700">Manager Dashboard</h2>}
        <button
          className="p-2 rounded focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors duration-200 ${currentSection === section.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => setCurrentSection(section.id)}
              title={isCollapsed ? section.name : ""}
            >
              <span className="mr-2">{section.icon}</span>
              {!isCollapsed && <span>{section.name}</span>}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
