import React, { useState, useEffect, useRef } from 'react';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, LogOut, Lock, Menu as MenuIcon
} from 'lucide-react';
import AdminSidebar from '../../Layouts/AdminSidebar';
import Dashboard from './Dashboard';
import EmployeList from './PIM/EmployeeList';
import Recruitment from './Recruitment';
import ManageReview from './Peformance/ManageReview';
import AdminImports from './AdminImports';
import Time from '../AdminDashboard/Time';
import MyInfo from './MyInfo';
import Claims from './Claims';
import LeaveApply from './Leave Dashboard/LeaveApply';
import Payroll from '../ManagerDashboard/Payroll';
import Security from './Security';
import SettingPage from './SettingPage';
import Support from './Support';
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from 'react-redux';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';

// Font Import (head injection for safety)
const addFonts = () => {
  const id = "custom-fonts-admin";
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Lato:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
};
addFonts();

const componentMap = {
  Dashboard: Dashboard,
  Employees: EmployeList,
  Recruitment: Recruitment,
  Performance: ManageReview,
  Admin: AdminImports,
  Time: Time,
  "My Info": MyInfo,
  Claims: Claims,
  Leave: LeaveApply,
  Payroll: Payroll,
  Security: Security,
  Support: Support,
  SettingPage: SettingPage,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Dashboard');
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);

  const ActiveComponent = componentMap[activeLink];

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById('main-content');
      setIsScrolled(mainContent?.scrollTop > 10);
    };
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'Logout':
        localStorage.removeItem('token');
        navigate('/login');
        break;
      case 'Security':
        setActiveLink('Security');
        break;
      default:
        break;
    }
  };

  const displayName = isLoading 
    ? 'Loading...' 
    : error 
    ? 'User' 
    : `${employee?.data?.employee?.firstName || ''} ${employee?.data?.employee?.lastName || ''}`;
  const displayEmail = userInfo?.email || '';

  // Greeting
  const greetingText = (() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  })();

  // Short info (customize as needed)
  const shortInfo = "";

  // Dropdown animation variant
  const menuVariants = {
    open: { opacity: 1, y: 0, pointerEvents: 'auto' },
    closed: { opacity: 0, y: -10, pointerEvents: 'none' }
  };

  // For accessibility: focus the first element when menu opens
  const menuFirstItem = useRef(null);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 font-sans">
      {/* Google Fonts import */}
      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Lato:wght@400;500;700&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: "Poppins", sans-serif; }
        body, .font-sans { font-family: "Lato", sans-serif; }
        .admin-greeting { font-family: 'Poppins',sans-serif; }
      `}</style>

      {/* Static Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64">
          <AdminSidebar
            isOpen={true}
            onClose={() => {}}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl"
            >
              <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header
          className={`z-40 sticky top-0 transition-all duration-300 ${isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-sm'
              : 'bg-white'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-20 md:h-24 gap-4 md:gap-6 justify-between">
              {/* Left Side: Sidebar Toggle (Mobile) + Greeting */}
              <div className="flex items-center gap-2 flex-1 md:flex-none min-w-0">
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <MenuIcon className="w-6 h-6 text-gray-600" />
                </button>
                {/* Greeting, now left-aligned */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 90, damping: 16 }}
                  className="flex flex-col items-start select-none min-w-0"
                >
                  <span className="text-xs text-gray-500 md:text-sm font-medium admin-greeting">
                    {greetingText}
                  </span>
                  <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight admin-greeting">
                    Welcome back!
                  </span>
                  <span className="text-sm text-gray-600 mt-1 truncate w-full" style={{maxWidth:"250px"}}>
                    {shortInfo}
                  </span>
                </motion.div>
              </div>
              {/* Right Side: Profile Icon with Name & Status Dot */}
              <div className="flex items-center ml-auto">
                <Menu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <Menu.Button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <div className="relative">
                          <UserCircle className="w-8 h-8 text-gray-700" />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-md" />
                        </div>
                        <span className="ml-2 font-semibold text-gray-900 text-base hidden sm:block admin-greeting">
                          {displayName}
                        </span>
                      </Menu.Button>
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            transition={{ duration: 0.15, type: 'spring', stiffness: 200, damping: 18 }}
                            className="absolute right-0 mt-3 w-72 origin-top-right rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                          >
                            <div className="flex flex-col items-center px-6 pt-6 pb-3">
                              <div className="relative mb-2">
                                <UserCircle className="w-12 h-12 text-indigo-500" />
                                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                              </div>
                              <div className="font-bold text-lg text-gray-900 mb-1 admin-greeting" ref={menuFirstItem} tabIndex={0}>
                                {displayName}
                              </div>
                              <div className="text-xs text-gray-500 mb-4 break-all text-center">{displayEmail}</div>
                              <div className="w-full border-t border-gray-100 mb-2" />
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleMenuAction('Security')}
                                    className={`${
                                      active ? 'bg-gray-50' : ''
                                    } flex items-center w-full px-6 py-3 transition-colors text-left`}
                                  >
                                    <Lock className="w-5 h-5 mr-3 text-indigo-500" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">
                                        Security
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Update password
                                      </div>
                                    </div>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleMenuAction('Logout')}
                                    className={`${
                                      active ? 'bg-gray-50' : ''
                                    } flex items-center w-full px-6 py-3 transition-colors text-left`}
                                  >
                                    <LogOut className="w-5 h-5 mr-3 text-red-500" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">
                                        Logout
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Sign out of account
                                      </div>
                                    </div>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex="0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLink}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;