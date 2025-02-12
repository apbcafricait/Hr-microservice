import React, { useState } from 'react';
import ApplyLeave from '../AdminDashboard/ApplyLeave';

const LeaveDashboard = () => {
  const [activeTab, setActiveTab] = useState('Apply');

  const renderContent = () => {
    switch (activeTab) {
      case 'Apply':
        return <ApplyLeave />; // Use the imported ApplyLeave component
      case 'My Leave':
        return <div>My Leave Details</div>;
      case 'Entitlements':
        return <div>Entitlements Information</div>;
      case 'Reports':
        return <div>Reports Overview</div>;
      case 'Configure':
        return <div>Configuration Settings</div>;
      case 'Leave List':
        return <div>List of Leaves</div>;
      case 'Assign Leave':
        return <div>Assign Leave to Employees</div>;
      default:
        return <div>Select a tab to view details</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          {['Apply', 'My Leave', 'Entitlements', 'Reports', 'Configure', 'Leave List', 'Assign Leave'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-indigo-500 hover:text-white transition duration-300`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default LeaveDashboard;
