import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '@headlessui/react';
import {
  Users, Briefcase, Building2, UserCircle, LogOut, Settings,
  HelpCircle, Lock, Sun, Moon, ChevronDown, Plus, Building,
  Users2, Network, ListTodo, FileText, BarChart2, Menu as MenuIcon,
} from 'lucide-react';
import AdminSidebar from '../../Layouts/AdminSidebar';
import Dashboard from './Dashboard';
import EmployeList from './PIM/EmployeeList';
import Recruitment from './Recruitment';
import ManageReview from './Peformance/ManageReview'
import AdminImports from './AdminImports';
import Time from '../AdminDashboard/Time'
import MyInfo from './MyInfo';
import Claims from './Claims';
import LeaveApply from './Leave Dashboard/LeaveApply'
import Payroll from '../ManagerDashboard/Payroll';

const componentMap = {
  Dashboard: Dashboard,
  PIM: EmployeList,
  Recruitment: Recruitment,
  Performance: ManageReview,
  Admin:AdminImports,
  Time: Time,
  "My Info": MyInfo,
  Claims: Claims,
  Leave:LeaveApply,
  Payroll:Payroll
};

const AdminDashboard = () => {
  const [theme, setTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const ActiveComponent = componentMap[activeLink];

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById('main-content');
      setIsScrolled(mainContent.scrollTop > 10);
    };

    const mainContent = document.getElementById('main-content');
    mainContent.addEventListener('scroll', handleScroll);
    return () => mainContent.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Static Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64">
          <AdminSidebar isOpen={true} onClose={() => {}} activeLink={activeLink} setActiveLink={setActiveLink} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <nav
          className={`z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Admin Dashboard
                </h1>
              </div>

              {/* Adjusted positioning for theme toggle and profile menu */}
              <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                </button>

                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <UserCircle className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hidden sm:block`}>Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {[
                        { icon: Settings, text: 'Settings', desc: 'Manage your preferences' },
                        { icon: HelpCircle, text: 'Support', desc: 'Get help' },
                        { icon: Lock, text: 'Security', desc: 'Update password' },
                        { icon: LogOut, text: 'Logout', desc: 'Sign out of account' },
                      ].map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-50 dark:bg-gray-700' : ''
                              } flex items-center w-full px-4 py-3 transition-colors`}
                            >
                              <item.icon className={`w-5 h-5 mr-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                              <div className="text-left">
                                <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                  {item.text}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
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
        <div 
          id="main-content"
          className="flex-1 overflow-y-auto"
        >
          {activeLink === "Admin" ? <AdminImports /> : <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;