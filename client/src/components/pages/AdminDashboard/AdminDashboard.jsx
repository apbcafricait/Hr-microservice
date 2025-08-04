import React, { useState, useEffect, useRef } from 'react';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, LogOut, Lock, Menu as MenuIcon, Bell, Search, X
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
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);

  const ActiveComponent = componentMap[activeLink];

  // Refs for focus management
  const sidebarRef = useRef(null);
  const searchRef = useRef(null);

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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

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
        setIsSidebarOpen(false); // Close sidebar on mobile
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

  // Greeting based on time
  const greetingText = (() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  })();

  // Animation variants
  const menuVariants = {
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      pointerEvents: 'auto',
      transition: { duration: 0.2, ease: "easeOut" }
    },
    closed: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      pointerEvents: 'none',
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Global Styles */}
      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: "Poppins", sans-serif; }
        body, .font-sans { font-family: "Inter", sans-serif; }
        .admin-greeting { font-family: 'Poppins', sans-serif; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Focus styles */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-72">
          <AdminSidebar
            isOpen={true}
            onClose={() => {}}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
            
            {/* Sidebar */}
            <motion.div 
              ref={sidebarRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full w-80 max-w-[85vw] bg-white shadow-2xl"
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
        {/* Enhanced Header */}
        <header
          className={`z-40 sticky top-0 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
              : 'bg-white shadow-sm'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 md:h-20 gap-3 md:gap-4 justify-between">
              
              {/* Left Side: Mobile Menu + Greeting + Search */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Toggle sidebar"
                >
                  <MenuIcon className="w-5 h-5 text-gray-600" />
                </button>

                {/* Greeting Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex flex-col items-start min-w-0 flex-1"
                >
                  <span className="text-xs text-gray-500 font-medium admin-greeting">
                    {greetingText}
                  </span>
                  <span className="text-base md:text-lg font-bold text-gray-900 tracking-tight admin-greeting truncate">
                    Welcome back!
                  </span>
                </motion.div>

                {/* Search Bar - Hidden on small screens */}
                <div className="hidden md:flex flex-1 max-w-md ml-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Notifications + Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Profile Menu */}
                <Menu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <div className="relative">
                          <UserCircle className="w-8 h-8 text-gray-700" />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                        </div>
                        <span className="hidden sm:block font-medium text-gray-900 text-sm admin-greeting truncate max-w-[120px]">
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
                            className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100"
                          >
                            {/* Profile Header */}
                            <div className="flex flex-col items-center px-6 pt-6 pb-4">
                              <div className="relative mb-3">
                                <UserCircle className="w-16 h-16 text-blue-500" />
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                              </div>
                              <div className="font-bold text-lg text-gray-900 mb-1 admin-greeting text-center">
                                {displayName}
                              </div>
                              <div className="text-sm text-gray-500 text-center break-all">
                                {displayEmail}
                              </div>
                              <div className="w-full border-t border-gray-100 mt-4" />
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleMenuAction('Security')}
                                    className={`${
                                      active ? 'bg-gray-50' : ''
                                    } flex items-center w-full px-6 py-3 transition-colors text-left hover:bg-gray-50`}
                                  >
                                    <Lock className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">
                                        Security Settings
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Update password & security
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
                                    } flex items-center w-full px-6 py-3 transition-colors text-left hover:bg-gray-50`}
                                  >
                                    <LogOut className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">
                                        Sign Out
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Logout from your account
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

            {/* Mobile Search Bar */}
            <div className="md:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto focus:outline-none scroll-smooth"
          tabIndex="0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLink}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
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