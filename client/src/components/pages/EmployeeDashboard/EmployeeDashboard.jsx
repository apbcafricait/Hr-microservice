import { useState } from 'react';
import {
  HomeIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  CogIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import ApplyLeave from './ApplyLeave';
import EmployeeProfile from './EmployeeProfile';
import TimeAtWork from './Timeatwork';
import Suggestion from './Suggestion';
import Claims from './Claims';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAttedanceOfEmployeeQuery } from '../../../slices/attendanceSlice'

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
import Dashboard from './Dashboard';
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
    { name: 'Claims', icon: DocumentTextIcon, component: 'Claims' },

  ];

  const renderSubComponent = () => {
  

    switch (activeSubComponent) {
      // In the Dashboard case of renderSubComponent:

      case 'Dashboard':
      return <Dashboard hideHeader={false}
      
      employeeName={employeeName}
        ClockIcon={ClockIcon}
        lastCheckIn={lastCheckIn}
        TotalLeaveBalances={TotalLeaveBalances}
        totalLeaveRequests={totalLeaveRequests}
        attendanceTrendData={attendanceTrendData}
        attendanceData={attendanceData}
        chartOptions={chartOptions}
        paymentData={paymentData}
        totalWorkingHours={totalWorkingHours}
      
      />
      case 'ApplyLeave':
        return <ApplyLeave  hideHeader={false} />; 
      case 'EmployeeProfile':
        return <EmployeeProfile />;
      case 'TimeAtWork':
        return <TimeAtWork hideHeader={false} />; 
      case 'Suggestion':
        return <Suggestion hideHeader={false} />; 
        case 'Claims':
          return <Claims hideHeader={false} />;
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
        className={`fixed left-0 top-16 h-[93vh] bg-white shadow-md z-100 text-gray-800 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'
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

      {/* Main Content */}
      <div className={`flex-1 ml-${isSidebarExpanded ? '64' : '16'} transition-all duration-300 mt-16`}>
        {renderSubComponent()}
      </div>

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

