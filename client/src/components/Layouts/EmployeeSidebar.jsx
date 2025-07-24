import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  LogoutIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { logout } from 'path-to-your-auth-slice'; // Uncomment and adjust as needed

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, component: 'EmployeeDashboard' },
  { name: 'Apply Leave', icon: CalendarIcon, component: 'ApplyLeave' },
  { name: 'Leave Approval', icon: ShieldCheckIcon, component: 'LeaveApproval' },
  { name: 'Qualifications', icon: AcademicCapIcon, component: 'Qualifications' },
  { name: 'Time at Work', icon: ClockIcon, component: 'TimeAtWork' },
  { name: 'Claims', icon: DocumentTextIcon, component: 'Claims' },
];

const iconColors = [
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-amber-500',
  'text-pink-500',
  'text-indigo-500',
];

const EmployeeSidebar = ({ setActiveComponent }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('EmployeeDashboard');
  const [hoveredItem, setHoveredItem] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarWidth = isExpanded ? 260 : 74;

  const handleItemClick = (component) => {
    setActiveItem(component);
    setActiveComponent(component);
  };

  const handleLogout = () => {
    // dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <motion.aside
        initial={{ width: sidebarWidth }}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 h-screen z-40
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl
          flex flex-col
          transition-all duration-300
          font-sans
        `}
        style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`
            absolute -right-3 top-6 hidden md:flex
            bg-gradient-to-tr from-blue-600 to-indigo-600
            rounded-full p-1.5 text-white shadow-lg
            hover:bg-blue-700 focus:outline-none z-50
            border-4 border-white dark:border-gray-900
            transition-all duration-200
          `}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </button>

        {/* Logo Section */}
        <div className={`p-6 pb-3 flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <UserIcon className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <AnimatePresence>
              {isExpanded && (
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
        </div>

        {/* Divider */}
        <div className="mx-4 mb-3 border-b border-gray-200 dark:border-gray-800" />

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300/70 scrollbar-track-transparent pr-1">
          <ul className="space-y-1 mt-2">
            {menuItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.component;
              const isHovered = hoveredItem === item.component;
              const iconColor =
                isActive
                  ? 'text-white'
                  : isHovered
                    ? 'text-blue-600'
                    : iconColors[idx % iconColors.length];
              const iconBg =
                isActive
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  : isHovered
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-gray-100 dark:bg-gray-800';

              return (
                <motion.li key={item.name} layout>
                  <a
                    href="#"
                    tabIndex={0}
                    onClick={e => {
                      e.preventDefault();
                      handleItemClick(item.component);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleItemClick(item.component);
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(item.component)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      group relative flex items-center w-full px-3 py-3
                      rounded-lg transition-all duration-200 outline-none
                      cursor-pointer select-none
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-300/20'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${isHovered && !isActive
                        ? 'ring-2 ring-blue-500/30'
                        : ''
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
                      {isExpanded && (
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
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* User/Compact Section (at bottom) */}
        <div
          className={`
            mt-auto pb-5 px-4 w-full
            flex ${isExpanded ? 'flex-row' : 'flex-col items-center'}
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
          {isExpanded && (
            <div className="overflow-hidden">
              <div
                className="text-[15px] font-semibold text-gray-900 dark:text-gray-200"
              >
                Employee
              </div>
              <div
                className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate"
              >
                employee@nexuspro.com
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 font-semibold"
          >
            <LogoutIcon className="w-5 h-5 mr-3" />
            {isExpanded && "Log Out"}
          </button>
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
    </>
  );
};

export default EmployeeSidebar;