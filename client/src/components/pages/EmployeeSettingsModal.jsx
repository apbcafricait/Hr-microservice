import React, { useState } from "react";

const EmployeeSettingsModal = ({ isOpen, onClose }) => {
  const [activeComponent, setActiveComponent] = useState("profile");

  if (!isOpen) return null;

  const handleComponentClick = (component) => {
    setActiveComponent(component);
  };

  const renderComponentDetails = () => {
    switch (activeComponent) {
      case "profile":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" placeholder="Enter employee name" />
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" placeholder="Enter employee email" />
          </div>
        );
      case "account":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" placeholder="kev.heart@mail.com" />
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">Change Password</button>
          </div>
        );
      case "chat":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
            <p>Configure your chat preferences here.</p>
          </div>
        );
      case "voice":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Voice & Video Settings</h3>
            <p>Adjust your voice and video settings.</p>
          </div>
        );
      case "appearance":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
            <p>Customize the look and feel of the application.</p>
          </div>
        );
      case "notification":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <p>Manage your notification preferences.</p>
          </div>
        );
      default:
        return <div className="p-4">Select a setting from the sidebar.</div>;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex">

        {/* Sidebar */}
        <div className="w-1/4 bg-white rounded-l-lg shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
          </div>
          <nav>
            <ul>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'profile' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('profile')}>Profile</li>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'account' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('account')}>Account</li>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'chat' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('chat')}>Chat</li>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'voice' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('voice')}>Voice & Video</li>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'appearance' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('appearance')}>Appearance</li>
              <li className={`p-3 hover:bg-gray-200 cursor-pointer ${activeComponent === 'notification' ? 'bg-gray-200' : ''}`} onClick={() => handleComponentClick('notification')}>Notification</li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
