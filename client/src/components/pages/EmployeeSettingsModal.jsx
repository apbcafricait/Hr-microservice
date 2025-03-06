import React, { useState } from "react";

const EmployeeSettingsModal = ({ isOpen, onClose }) => {
  const [activeComponent, setActiveComponent] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (!isOpen) return null;

  const handleComponentClick = (component) => {
    setActiveComponent(component);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Optional: Add logic to persist theme preference (e.g., localStorage)
    // localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const renderComponentDetails = () => {
    switch (activeComponent) {
      case "profile":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
            <label className="block text-sm font-bold mb-2">Name:</label>
            <input 
              type="text" 
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700 border-gray-300'
              }`}
              placeholder="Enter employee name" 
            />
            <label className="block text-sm font-bold mb-2">Email:</label>
            <input 
              type="email" 
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700 border-gray-300'
              }`}
              placeholder="Enter employee email" 
            />
          </div>
        );
      case "appearance":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
            <div className="flex items-center gap-4">
              <p>Theme:</p>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full focus:outline-none transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </div>
        );
      case "account":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <label className="block text-sm font-bold mb-2">Email:</label>
            <input 
              type="email" 
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mb-4 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700 border-gray-300'
              }`}
              placeholder="kev.heart@mail.com" 
            />
            <label className="block text-sm font-bold mb-2">Password:</label>
            <button className={`${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4`}>
              Change Password
            </button>
          </div>
        );
      case "chat":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
            <p>Configure your chat preferences here.</p>
          </div>
        );
      case "voice":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Voice & Video Settings</h3>
            <p>Adjust your voice and video settings.</p>
          </div>
        );
      case "notification":
        return (
          <div className={`rounded-lg shadow-md p-6 transition-opacity duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <p>Manage your notification preferences.</p>
          </div>
        );
      default:
        return (
          <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Select a setting from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Sidebar */}
        <div className={`w-1/4 rounded-l-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 ${isDarkMode ? 'text-white' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
          </div>
          <nav>
            <ul>
              {[
                'profile',
                'account',
                'chat',
                'voice',
                'appearance',
                'notification'
              ].map((item) => (
                <li
                  key={item}
                  className={`p-3 hover:bg-gray-200 cursor-pointer ${
                    activeComponent === item ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''
                  } ${isDarkMode ? 'text-white hover:bg-gray-700' : ''}`}
                  onClick={() => handleComponentClick(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1')}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <div className="flex justify-end">
            <button onClick={onClose} className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {renderComponentDetails()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettingsModal;