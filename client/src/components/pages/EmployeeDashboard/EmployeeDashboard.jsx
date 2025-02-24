
import  { useState } from 'react';
import {
  HomeIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,

  UserGroupIcon,

  CogIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ApplyLeave from './ApplyLeave';
import EmployeeProfile from './EmployeeProfile';


import Suggestion from './Suggestion';
import PersonalDetails from './PersonalDetails';
import ReportTo from './ReportTo';
import TimeAtWork from './Timeatwork';


const EmployeeDashboard = () => {
  const [activeSubComponent, setActiveSubComponent] = useState("Dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const employeeId = userInfo?.employeeId || 18;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(employeeId);

  const subMenuItems = [
    { name: "Dashboard", icon: HomeIcon, component: "Dashboard" },
    { name: "dashboard", icon: ClockIcon, component: "dashboard" },
    { name: "Apply Leave", icon: CalendarIcon, component: "ApplyLeave" },
    { name: "Suggestion", icon: DocumentTextIcon, component: "Suggestion" },
    { name: "Time at Work", icon: ClockIcon, component: "TimeAtWork" },
  ];
    const renderSubComponent = () => {
    switch (activeSubComponent) {
      case "Dashboard":
        return (

          <div className="p-6 grid grid-cols-3 gap-4">
            {/* Blank Cards */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 p-4 flex items-center justify-center"
              >
                <span className="text-gray-400">Card {index + 1}</span>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Today’s Attendance</h3>
                <p>Check-in: 9:00 AM</p>
            <p>Check-out: --</p>
              </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Leave Balance</h3>
                <p>Annual: 15 days</p>
                <p>Sick: 7 days</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Pending Tasks</h3>
                <p>3 tasks due this week</p>
              </div>
            </div>
          </div>
        );
      case "ApplyLeave":
        return <ApplyLeave />;
      case "EmployeeProfile":
        return <EmployeeProfile />;
      case "TimeAtWork":
        return <TimeAtWork />;
      case "Suggestion":
        return <Suggestion />;
        case "dashboard":
          return <Dashboard/>;
      default:
        return <div>Select an option</div>;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
    <div className={`w-${isSidebarExpanded ? '64' : '16'} h-screen bg-gray-100 text-gray-800 flex flex-col transition-all duration-300`}>
        <div className="p-6 flex-1">
          <div className="mb-6 flex">
            {isSidebarExpanded && <h2 className="text-xl font-bold">Dashboard Menu</h2>}
            <button 
              onClick={toggleSidebar} 
              className="ml-auto p-2 rounded-full hover:bg-gray-200"
            >
              {isSidebarExpanded ? <ChevronLeftIcon className="w-4 h-4 text-gray-800" /> : <ChevronRightIcon className="w-4 h-4 text-gray-800" />}
            </button>
          </div>
          <nav>
            <ul>
              {subMenuItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <button
                    onClick={() => setActiveSubComponent(item.component)}
                    className="flex items-center w-full p-3 rounded hover:bg-gray-200"
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {isSidebarExpanded && item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* User Profile and Settings Section */}
        <div className="p-6 flex flex-col items-start">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center mb-2 p-2 rounded-lg hover:bg-blue-200"
            >
              <UserIcon className="w-6 h-6 text-gray-800" />
            </button>
            <button className="flex items-center p-2 rounded-lg hover:bg-blue-200">
              <CogIcon className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    {/* Main Content */}
      <div className="flex-1">{renderSubComponent()}</div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-end">
            <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <XMarkIcon className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              User Options
            </h3>
            <div className="mt-2">
              <button
              onClick={() => { 
                  setActiveSubComponent('EmployeeProfile');
                  setShowProfileModal(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded"
              >
                Profile
              </button>
              <button
              onClick={() => { 
                  alert('Logging out...'); // Placeholder for logout functionality
                  setShowProfileModal(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded mt-2"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
