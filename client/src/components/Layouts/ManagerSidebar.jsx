// ManagerSidebar.jsx
import React from "react";

const ManagerSidebar = ({ currentSection, setCurrentSection }) => {
  const sections = [
    { name: "Dashboard", id: "dashboard" },
    { name: "Employees", id: "employees" },
    { name: "Leave", id: "leave" },
    { name: "Recruitment", id: "recruitment" },
    { name: "Performance", id: "performance" },
    { name: "Settings", id: "settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
      <h2 className="text-lg font-bold text-gray-700">Manager Dashboard</h2>
      <nav className="mt-4">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`p-2 rounded cursor-pointer ${
                currentSection === section.id
                  ? "bg-gray-200 font-bold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentSection(section.id)}
            >
              {section.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
