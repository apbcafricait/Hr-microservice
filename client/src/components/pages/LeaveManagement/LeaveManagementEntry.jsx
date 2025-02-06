import React, { useState } from 'react';
import LeaveDashboard from './LeaveDashboard';
//import ApplyLeave from './ApplyLeave';
import LeaveRequests from './LeaveRequests';
import LeaveHistory from './LeaveHistory';
//import LeaveApproval from './LeaveApproval';
import LeaveBalance from './LeaveBalance';
import LeaveTypeManagement from './LeaveTypeManagement';
import LeaveSettings from './LeaveSettings';

const Index = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('dashboard'); // Default tab is Dashboard

  // Define a mapping of tabs to components
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <LeaveDashboard />;
      case 'apply-leave':
        return <ApplyLeave />;
      case 'leave-requests':
        return <LeaveRequests />;
      case 'leave-history':
        return <LeaveHistory />;
      case 'leave-approval':
        return <LeaveApproval />;
      case 'leave-balance':
        return <LeaveBalance />;
      case 'leave-type':
        return <LeaveTypeManagement />;
      case 'leave-settings':
        return <LeaveSettings />;
      default:
        return <LeaveDashboard />; // Default content
    }
  };

  // Define the list of tabs
  const tabs = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Apply Leave', value: 'apply-leave' },
    { label: 'Leave Requests', value: 'leave-requests' },
    { label: 'Leave History', value: 'leave-history' },
    { label: 'Leave Approval', value: 'leave-approval' },
    { label: 'Leave Balance', value: 'leave-balance' },
    { label: 'Leave Type Management', value: 'leave-type' },
    { label: 'Leave Settings', value: 'leave-settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Leave Management Dashboard</h1>
      </div>

      {/* Tab Buttons */}
      <div className="bg-white shadow p-4 rounded-lg mt-4">
        <div className="flex gap-4 flex-wrap">
          {tabs.map(({ label, value }) => (
            <button
              key={value}
              className={`px-4 py-2 rounded-md ${
                activeTab === value
                  ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamically Rendered Content */}
      <div className="mt-4 bg-white shadow p-4 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;