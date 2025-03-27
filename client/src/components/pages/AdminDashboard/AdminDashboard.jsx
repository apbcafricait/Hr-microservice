import React, { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Building2, UserCircle, LogOut, Settings,
  HelpCircle, Lock, ChevronDown, Menu as MenuIcon,
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

// Mapping of sidebar links to their components
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
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    isLoading: true,
    error: null
  });

  const ActiveComponent = componentMap[activeLink];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setUserData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchUserData();
  }, []);

  // Handle scroll effect for sticky header
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

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle user menu actions
  const handleMenuAction = (action) => {
    switch (action) {
      case 'Logout':
        // Add logout logic here
        localStorage.removeItem('token'); // Clear auth token
        navigate('/login');
        break;
      case 'Security':
        setActiveLink('Security');
        break;
      case 'Support':
        setActiveLink('Support');
        break;
      case 'Settings':
        setActiveLink('SettingPage');
        break;
      default:
        break;
    }
  };

  // Display user's full name or loading state
  const displayName = userData.isLoading 
    ? 'Loading...' 
    : userData.error 
    ? 'User' 
    : `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
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
              className="absolute inset-0 bg-gray-600 opacity-75"
              onClick={toggleSidebar}
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
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
        <nav
          className={`z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-lg'
              : 'bg-white'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {userData.firstName ? userData.firstName[0] : 'A'}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <UserCircle className="w-6 h-6 text-gray-600" />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 hidden sm:block">
                        {displayName}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {[
                        {
                          icon: Settings,
                          text: 'Settings',
                          desc: 'Manage your preferences',
                          onClick: () => handleMenuAction('Settings'),
                        },
                        {
                          icon: HelpCircle,
                          text: 'Support',
                          desc: 'Get help',
                          onClick: () => handleMenuAction('Support'),
                        },
                        {
                          icon: Lock,
                          text: 'Security',
                          desc: 'Update password',
                          onClick: () => handleMenuAction('Security'),
                        },
                        {
                          icon: LogOut,
                          text: 'Logout',
                          desc: 'Sign out of account',
                          onClick: () => handleMenuAction('Logout'),
                        },
                      ].map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <button
                              onClick={item.onClick}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex items-center w-full px-4 py-3 transition-colors`}
                            >
                              <item.icon className="w-5 h-5 mr-3 text-gray-600" />
                              <div className="text-left">
                                <div className="text-sm font-medium text-gray-700">
                                  {item.text}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.desc}
                                </div>
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
        </nav>

        {/* Scrollable Content Area */}
        <div id="main-content" className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLink}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;