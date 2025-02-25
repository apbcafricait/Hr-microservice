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
import { useSelector } from 'react-redux';
import { useGetAttedanceOfEmployeeQuery } from '../../../slices/attendanceSlice'
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useGetLeaveBalanceQuery } from '../../../slices/leaveBalancesApiSlice';
import { useGetDepartmentsQuery } from '../../../slices/departmentsApiSlice';
import { useGetAllLeaveRequestsQuery } from '../../../slices/leaveApiSlice'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const EmployeeDashboard = () => {
  const [activeSubComponent, setActiveSubComponent] = useState('Dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo)
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);

  const organisationName = employee?.data.employee.organisation.name?.toUpperCase();
  const organisationId = employee?.data.employee.organisation.id
  const employeeName = employee?.data.employee.firstName;
  const navigate = useNavigate();
  const employeeId = employee?.data.employee.id;
  const { data: attendanceData } = useGetAttedanceOfEmployeeQuery(employeeId);
 
const {data: leavebalances} = useGetLeaveBalanceQuery(employeeId)
  const TotalLeaveBalances = leavebalances?.data?.leaveBalance?.annualLeave +
    leavebalances?.data?.leaveBalance?.sickLeave +
    leavebalances?.data?.leaveBalance?.compassionateLeave

  const { data: orgDepartments } = useGetDepartmentsQuery(organisationId)
  console.log(orgDepartments, "org departments")

  const {data: leaveRequests} = useGetAllLeaveRequestsQuery(employeeId)
  console.log(leaveRequests, 'leave Requests')


  // Default to an empty array if leaveRequests or leaveRequests.data is undefined
  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.filter(
    (request) => request.employeeId === employeeId
  );
  console.log(totalLeaveRequests?.length, 'total leave Requests');

  const getLastCheckIn = (attendanceData) => {
    if (!attendanceData || attendanceData.length === 0) return null;

    // Sort by clockIn date descending (most recent first)
    const sortedData = [...attendanceData].sort((a, b) =>
      new Date(b.clockIn) - new Date(a.clockIn)
    );

    // Get the most recent entry
    const lastEntry = sortedData[0];

    // Add day name using Intl.DateTimeFormat
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
      .format(new Date(lastEntry.clockIn));

    // Return the entry with the day name added
    return {
      ...lastEntry,
      dayName
    };
  };

  // Usage example:
  const lastCheckIn = getLastCheckIn(attendanceData);

  if (lastCheckIn) {
    console.log('Most recent check-in:', lastCheckIn.clockIn);
    console.log('Day:', lastCheckIn.dayName); // Will log "Wednesday" for 2025-02-12
  }


  // Get current month (0-based: February = 1)
  const currentMonth = new Date().getUTCMonth(); // Today: 1 (February)

  // Calculate total hours for the current month
  const totalWorkingHours = attendanceData
    ?.filter(entry => {
      const clockInDate = new Date(entry.clockIn);
      return clockInDate.getUTCMonth() === currentMonth && entry.clockOut !== null;
    })
    .reduce((total, entry) => {
      const clockIn = new Date(entry.clockIn);
      const clockOut = new Date(entry.clockOut);
      const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60); // Convert to hours
      return total + hoursWorked;
    }, 0)
    .toFixed(2) || "0.00"; // Format to 2dp, fallback to "0.00"

  // Mock payment data (replace with real data if available)
  const paymentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Monthly Salary ($)',
        data: [3000, 3200, 3100, 3500],
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Attendance trend data from your DB
  const attendanceTrendData = (attendanceData) => {
    // Handle empty or undefined attendanceData
    if (!attendanceData || attendanceData.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Clock-In Times',
            data: [],
            borderColor: 'rgba(16, 185, 129, 1)', // Tailwind green-500
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Create a copy of the array and sort it
    const sortedData = [...attendanceData].sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn));

    return {
      labels: sortedData.map((entry) => new Date(entry.clockIn).toLocaleDateString()),
      datasets: [
        {
          label: 'Clock-In Times',
          data: sortedData.map((entry) => new Date(entry.clockIn).getHours() + parseInt(entry.clockIn.slice(14, 16)) / 60),
          borderColor: 'rgba(16, 185, 129, 1)', // Tailwind green-500
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

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
            <span className="mr-2">Hello, {employeeName }</span>
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
      // In the Dashboard case of renderSubComponent:

      case 'Dashboard':
        return (
          <div className="min-h-screen bg-gray-100 flex flex-col">
            {renderHeader()}
            <div className="p-6 flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back, {employeeName}!</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
                      <ClockIcon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-semibold bg-blue-400 bg-opacity-30 px-2 py-1 rounded-full">
                      {lastCheckIn?.dayName}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">  {new Date(lastCheckIn?.clockIn).toLocaleString()}</h3>
                  <p className="text-blue-100">Last Check-in</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-400 bg-opacity-30 rounded-lg">
                      <CalendarIcon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-semibold bg-green-400 bg-opacity-30 px-2 py-1 rounded-full">
                      Available
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{TotalLeaveBalances} Days</h3>
                  <p className="text-green-100">Leave Balance</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-400 bg-opacity-30 rounded-lg">
                      <DocumentTextIcon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-semibold bg-purple-400 bg-opacity-30 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{totalLeaveRequests?.length}</h3>
                  <p className="text-purple-100">Leave Requests</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-400 bg-opacity-30 rounded-lg">
                      <UserGroupIcon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-semibold bg-orange-400 bg-opacity-30 px-2 py-1 rounded-full">
                      Team
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">12</h3>
                  <p className="text-orange-100">Department Members</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Attendance Trend Line Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Trend</h3>
                  <div className="relative h-64">
                    <Line
                      data={attendanceTrendData(attendanceData)}
                      options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Clock-In Patterns' } } }}
                      className="w-full h-full"
                    />
                  </div>
                  {lastCheckIn && (
                    <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <ClockIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Last Check-in: {new Date(lastCheckIn.clockIn).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{lastCheckIn.dayName}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Distribution Bar Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Overview</h3>
                  <div className="relative h-64">
                    <Bar
                      data={paymentData}
                      options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Payments' } } }}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <CalendarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Next Payroll</p>
                      <p className="text-xs text-gray-500">March 1, 2025</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Working Hours</h3>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <ClockIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{totalWorkingHours}</p>
                      <p className="text-sm text-gray-500">Hours this month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CalendarIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">5/20</p>
                      <p className="text-sm text-gray-500">Days taken</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h3>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">3</p>
                      <p className="text-sm text-gray-500">Submitted</p>
                    </div>
                  </div>
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
        className={`h-screen bg-gray-200 text-gray-800 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'
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
                  className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${activeSubComponent === item.component ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                    }`}
                >
                  <item.icon className="w-6 h-6 min-w-[24px]" />
                  {isSidebarExpanded && <span className="ml-3">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-300">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 hover:bg-blue-200"
              >
                <UserIcon className="w-6 h-6 min-w-[24px]" />
                {isSidebarExpanded && <span className="ml-3">Profile</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => {/* Handle settings click */ }}
                className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 hover:bg-blue-200"
              >
                <CogIcon className="w-6 h-6 min-w-[24px]" />
                {isSidebarExpanded && <span className="ml-3">Settings</span>}
              </button>
            </li>
          </ul>
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

