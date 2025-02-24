import { useState } from 'react';
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
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import ApplyLeave from './ApplyLeave';
import EmployeeProfile from './EmployeeProfile';
import TimeAtWork from './Timeatwork';
import Suggestion from './Suggestion';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [activeSubComponent, setActiveSubComponent] = useState('Dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const employeeId = userInfo?.employeeId || 18;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(employeeId);

  const organisationName = employee?.data.employee.organisation.name?.toUpperCase();
  const employeeName = employee?.data.employee.firstName;
  const navigate = useNavigate();

  const subMenuItems = [
    { name: 'Dashboard', icon: HomeIcon, component: 'Dashboard' },
    { name: 'Apply Leave', icon: CalendarIcon, component: 'ApplyLeave' },
    { name: 'Suggestion', icon: DocumentTextIcon, component: 'Suggestion' },
    { name: 'Time at Work', icon: ClockIcon, component: 'TimeAtWork' },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (option) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    switch (option) {
      case 'Profile':
        setActiveSubComponent('EmployeeProfile'); // Switch to EmployeeProfile component
        break;
      case 'Settings':
        navigate('/settings'); // Replace with your settings route
        break;
      case 'About':
        navigate('/about'); // Replace with your about route
        break;
      case 'Change Password':
        navigate('/change-password'); // Replace with your change password route
        break;
      default:
        break;
    }
  };

  const renderSubComponent = () => {
    const renderHeader = () => (
      <header className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-lg">
        <div className="text-start flex-1">
          <h1 className="text-2xl font-semibold text-gray-700">
            {organisationName || 'Unknown Organisation'}
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 focus:outline-none"
          >
            <span className="mr-2">Hello, {employeeName || 'Employee'}</span>
            <svg
              className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 9 l-7 7 l-7 -7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <ul className="py-1">
                {['Profile', 'Settings', 'About', 'Change Password'].map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleMenuClick(option)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
    );

    switch (activeSubComponent) {
      case 'Dashboard':
        return (
          <div className="min-h-screen bg-gray-100 flex flex-col">
            {renderHeader()}
            <div className="p-6 flex-1">
              <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 p-4 flex items-center justify-center"
                  >
                    <span className="text-gray-400">Card {index + 1}</span>
                  </div>
                ))}
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">Today's Attendance</h3>
                  <p>Check-in: 9:00 AM</p>
                  <p>Check-out: --</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ApplyLeave':
        return <ApplyLeave hideHeader={true} />; // Pass hideHeader to avoid duplication
      case 'EmployeeProfile':
        return <EmployeeProfile />;
      case 'TimeAtWork':
        return <TimeAtWork hideHeader={true} />; // Pass hideHeader to avoid duplication
      case 'Suggestion':
        return <Suggestion hideHeader={true} />; // Pass hideHeader to avoid duplication
      default:
        return (
          <div className="min-h-screen bg-gray-100 flex flex-col">
            {renderHeader()}
            <div className="p-6 flex-1">Select an option</div>
          </div>
        );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-200 text-gray-800 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarExpanded && <h2 className="text-xl font-bold text-gray-800">Dashboard Menu</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isSidebarExpanded ? (
              <ChevronLeftIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {subMenuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => setActiveSubComponent(item.component)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                    activeSubComponent === item.component ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                  }`}
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  {isSidebarExpanded && item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
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
      <div className="flex-1">{renderSubComponent()}</div>
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
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Options</h3>
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
                  alert('Logging out...');
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