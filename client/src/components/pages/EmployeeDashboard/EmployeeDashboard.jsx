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
import { useGetAttedanceOfEmployeeQuery } from '../../../slices/attendanceSlice';
import { useGetAllSuggestionsQuery } from '../../../slices/suggestionsApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetLeaveBalanceQuery } from '../../../slices/leaveBalancesApiSlice';
//import { useGetDepartmentsQuery } from '../../../slices/departmentsApiSlice';
import { useGetAllLeaveRequestsQuery } from '../../../slices/leaveApiSlice';
import Dashboard from './Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import EmployeeHeader from '../../Layouts/EmployeeHeader'; // 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const iconColors = [
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-amber-500',
  'text-indigo-500',
];

const EmployeeDashboard = () => {
  const [activeSubComponent, setActiveSubComponent] = useState('Dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);

  const organisationName = employee?.data.employee.organisation.name?.toUpperCase();
  const organisationId = employee?.data.employee.organisation.id;
  const employeeName = employee?.data.employee.firstName;
  const navigate = useNavigate();
  const employeeId = employee?.data.employee.id;

  const { data } = useGetAttedanceOfEmployeeQuery(employeeId);
  const attendanceData = data?.data || data || []; // Handle nested or flat response
  const { data: leavebalances } = useGetLeaveBalanceQuery(employeeId);
  // const { data: orgDepartments } = useGetDepartmentsQuery(organisationId);
  const { data: leaveRequests } = useGetAllLeaveRequestsQuery(employeeId);

  const {
    data: suggestions,
    isLoading: isSuggestionsLoading,
  } = useGetAllSuggestionsQuery(
    organisationId ? { organisationId } : skipToken,
    { skip: !organisationId }
  );

  const totalSuggestions = suggestions?.data?.suggestions || [];
  const filteredSuggestions = totalSuggestions.filter(
    (suggestion) => suggestion.employeeId === employeeId
  );
  const totalSuggestionsCount = filteredSuggestions.length;

  const TotalLeaveBalances =
    leavebalances?.data?.leaveBalance?.annualLeave +
    leavebalances?.data?.leaveBalance?.sickLeave +
    leavebalances?.data?.leaveBalance?.compassionateLeave;

  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.filter(
    (request) => request.employeeId === employeeId
  );

  const getLastCheckIn = (attendanceData) => {
    if (!attendanceData || attendanceData.length === 0) return null;
    const sortedData = [...attendanceData].sort(
      (a, b) => new Date(b.clockIn) - new Date(a.clockIn)
    );
    const lastEntry = sortedData[0];
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
      new Date(lastEntry.clockIn)
    );
    return {
      clockIn: lastEntry.clockIn,
      clockOut: lastEntry.clockOut,
      dayName,
    };
  };

  const lastCheckIn = getLastCheckIn(attendanceData);

  const currentMonth = new Date().getUTCMonth();
  const totalWorkingHours =
    attendanceData
      ?.filter(
        (entry) =>
          new Date(entry.clockIn).getUTCMonth() === currentMonth && entry.clockOut !== null
      )
      .reduce((total, entry) => {
        const clockIn = new Date(entry.clockIn);
        const clockOut = new Date(entry.clockOut);
        const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60);
        return total + hoursWorked;
      }, 0)
      .toFixed(2) || '0.00';

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
      case 'Dashboard':
        return (
          <Dashboard
            hideHeader={false}
            employeeName={employeeName}
            ClockIcon={ClockIcon}
            lastCheckIn={lastCheckIn}
            TotalLeaveBalances={TotalLeaveBalances}
            totalLeaveRequests={totalLeaveRequests}
            attendanceData={attendanceData}
            chartOptions={chartOptions}
            totalWorkingHours={totalWorkingHours}
            totalSuggestionsCount={totalSuggestionsCount}
            isSuggestionsLoading={isSuggestionsLoading}
          />
        );
      case 'ApplyLeave':
        return <ApplyLeave hideHeader={false} />;
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
            <div className="p-6 flex-1">Select an option</div>
          </div>
        );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <>
      <EmployeeHeader />
      <div className="flex min-h-screen bg-gray-50" style={{ marginTop: '64px' }}>
        {/* Sidebar - sticky and full height */}
        <motion.aside
          initial={{ width: isSidebarExpanded ? 260 : 74 }}
          animate={{ width: isSidebarExpanded ? 260 : 74 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`
            sticky top-0 self-start
            h-[calc(100vh-64px)]
            bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl
            flex flex-col
            transition-all duration-300
            font-sans
            z-30
          `}
          style={{
            width: isSidebarExpanded ? 260 : 74,
            minWidth: isSidebarExpanded ? 260 : 74,
            maxWidth: isSidebarExpanded ? 260 : 74,
          }}
        >
          {/* Sidebar header with logo and toggle button */}
          <div className={`flex items-center justify-between p-6 pb-3`}>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <UserIcon className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent select-none"
                    style={{ letterSpacing: '.01em' }}
                  >
                    Employee
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
            {/* Toggle Button at top right */}
            <button
              onClick={toggleSidebar}
              aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className={`
                flex items-center justify-center
                bg-gradient-to-tr from-blue-600 to-indigo-600
                rounded-full p-1.5 text-white shadow-lg
                hover:bg-blue-700 focus:outline-none z-50
                border-4 border-white dark:border-gray-900
                transition-all duration-200
                ml-2
              `}
              style={{ marginLeft: isSidebarExpanded ? '12px' : '0' }}
            >
              <motion.div
                animate={{ rotate: isSidebarExpanded ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeftIcon className={`w-4 h-4 ${isSidebarExpanded ? '' : 'rotate-180'}`} />
              </motion.div>
            </button>
          </div>

          {/* Divider */}
          <div className="mx-4 mb-3 border-b border-gray-200 dark:border-gray-800" />

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300/70 scrollbar-track-transparent pr-1">
            <ul className="space-y-1 mt-2">
              {subMenuItems.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = activeSubComponent === item.component;
                const iconColor =
                  isActive
                    ? 'text-white'
                    : iconColors[idx % iconColors.length];
                const iconBg =
                  isActive
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gray-100 dark:bg-gray-800';

                return (
                  <motion.li key={item.name} layout>
                    <button
                      onClick={() => setActiveSubComponent(item.component)}
                      className={`
                        group relative flex items-center w-full px-3 py-3
                        rounded-lg transition-all duration-200 outline-none
                        cursor-pointer select-none
                        ${isActive
                          ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-300/20'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                      `}
                    >
                      <span
                        className={`
                          flex items-center justify-center w-9 h-9 mr-3 transition-all duration-200
                          rounded-lg ${iconBg}
                          ${isActive ? 'shadow-lg' : 'shadow'}
                        `}
                      >
                        <IconComponent
                          className={`
                            w-5 h-5 flex-shrink-0 transition-colors duration-200
                            ${iconColor}
                          `}
                        />
                      </span>
                      <AnimatePresence>
                        {isSidebarExpanded && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.18 }}
                            className={`
                              font-medium text-base tracking-tight
                              ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-100'}
                              transition-colors
                            `}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-full bg-blue-500 shadow-lg"></span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User/Compact Section (at bottom) */}
          <div
            className={`
              mt-auto pb-5 px-4 w-full
              flex ${isSidebarExpanded ? 'flex-row' : 'flex-col items-center'}
              items-center gap-3 min-h-[70px] max-h-[100px]
              transition-all duration-300
            `}
          >
            <div
              className={`
                flex items-center justify-center w-11 h-11
                bg-gradient-to-br from-indigo-400 to-blue-500
                rounded-full shadow-lg
                border-2 border-white dark:border-gray-900
              `}
            >
              <UserIcon className="w-5 h-5 text-white drop-shadow" />
            </div>
            {isSidebarExpanded && (
              <div className="overflow-hidden">
                <div
                  className="text-[15px] font-semibold text-gray-900 dark:text-gray-200"
                >
                  Employee
                </div>
                <div
                  className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate"
                >
                  {userInfo?.email || 'employee@nexuspro.com'}
                </div>
              </div>
            )}
          </div>

          {/* Subtle noise overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            style={{
              backgroundImage:
                'url("https://www.transparenttextures.com/patterns/cubes.png")',
              backgroundSize: '120px 120px',
              mixBlendMode: 'overlay',
              opacity: '0.06'
            }}
          />
        </motion.aside>

        {/* Main content area */}
        <motion.div
          className="flex-1 transition-all duration-300"
          style={{
            minWidth: 0,
          }}
        >
          {renderSubComponent()}
        </motion.div>

        {/* Profile Modal (unchanged) */}
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
    </>
  );
};

export default EmployeeDashboard;