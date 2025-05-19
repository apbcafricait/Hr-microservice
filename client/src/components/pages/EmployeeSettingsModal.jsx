import React, { useState } from "react";
import ChangePassword from "./EmployeeDashboard/ChangePassword";

const EmployeeSettingsModal = ({ isOpen, onClose }) => {
  const [activeComponent, setActiveComponent] = useState("change-password");
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`w-1/4 rounded-l-lg shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
          </div>
          <nav>
            <ul>
              {["profile", "change-password"].map((item) => (
                <li
                  key={item}
                  className={`p-3 cursor-pointer hover:bg-gray-200 ${
                    activeComponent === item
                      ? isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-200"
                      : ""
                  } ${
                    isDarkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => setActiveComponent(item)}
                >
                  {item.charAt(0).toUpperCase() +
                    item.slice(1).replace(/-/g, " ")}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-0 flex">
          <div className="w-full h-full">
            {activeComponent === "change-password" && <ChangePassword />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettingsModal;
