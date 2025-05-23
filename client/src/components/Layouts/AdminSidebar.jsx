import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Users,
  Calendar,
  Clock,
  UserPlus,
  User,
  Home,
  FileText,
  Award,
  ChevronRight,
  BarChart2,
  Shield,
  DollarSign,
  ClipboardList,
  Briefcase
} from 'lucide-react';

// Ensure Poppins and Lato fonts are loaded in your index.html or layout!
// <link href="https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet">

const menuItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Admin', icon: Shield },
  { name: 'Employees', icon: Users },
  { name: 'Leave', icon: Calendar },
  { name: 'Recruitment', icon: UserPlus },
  { name: 'Performance', icon: BarChart2 },
  { name: "Payroll", icon: DollarSign },
  { name: 'Time', icon: Clock },
  { name: 'My Info', icon: User },
  { name: 'Claims', icon: ClipboardList },
  { name: 'Settings', icon: Settings },
];

const iconColors = [
  'text-purple-500',
  'text-indigo-500',
  'text-pink-500',
  'text-blue-500',
  'text-teal-500',
  'text-amber-500',
  'text-emerald-500',
  'text-orange-500',
  'text-sky-500',
  'text-rose-500',
  'text-fuchsia-500'
];

const Sidebar = ({ activeLink, setActiveLink }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = isExpanded ? 260 : 74;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } md:hidden`}
        onClick={() => setMobileOpen(false)}
      />

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
          [font-family:'Poppins',sans-serif]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
        style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth }}
      >
        {/* Toggle Button (Desktop) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`
            absolute -right-3 top-6 hidden md:flex
            bg-gradient-to-tr from-purple-600 to-indigo-600
            rounded-full p-1.5 text-white shadow-lg
            hover:bg-purple-700 focus:outline-none z-50
            border-4 border-white dark:border-gray-900
            transition-all duration-200
          `}
          style={{
            boxShadow: '0 2px 12px 0 rgba(80,0,180,0.1), 0 1.5px 4px 0 rgba(80,0,180,0.08)'
          }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Toggle Button (Mobile) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open sidebar"
          className="md:hidden fixed top-5 left-4 z-50 bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-full text-white shadow-md"
        >
          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Logo Section */}
        <div className={`p-6 pb-3 flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent select-none"
                  style={{ letterSpacing: '.01em' }}
                >
                  Nexus Pro
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-3 border-b border-gray-200 dark:border-gray-800" />

        {/* Navigation Menu (scrollable) */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300/70 scrollbar-track-transparent pr-1">
          <ul className="space-y-1 mt-2">
            {menuItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeLink === item.name;
              const isHovered = hoveredLink === item.name;
              // Cycle through color classes for unique icon color
              const iconColor =
                isActive
                  ? 'text-white'
                  : isHovered
                    ? 'text-purple-600'
                    : iconColors[idx % iconColors.length];

              // Add nice active/hover background for icon
              const iconBg =
                isActive
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                  : isHovered
                    ? 'bg-purple-100 dark:bg-purple-900'
                    : 'bg-gray-100 dark:bg-gray-800';

              return (
                <motion.li key={item.name} layout>
                  <a
                    href="#"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveLink(item.name);
                      setMobileOpen(false);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveLink(item.name);
                        setMobileOpen(false);
                      }
                    }}
                    onMouseEnter={() => setHoveredLink(item.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`
                      group relative flex items-center w-full px-3 py-3
                      rounded-lg transition-all duration-200 outline-none
                      cursor-pointer select-none
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-300/20'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${isHovered && !isActive
                        ? 'ring-2 ring-purple-500/30'
                        : ''
                      }
                      focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none
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
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-full bg-purple-500 shadow-lg"></span>
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
              bg-gradient-to-br from-indigo-400 to-purple-500
              rounded-full shadow-lg
              border-2 border-white dark:border-gray-900
            `}
          >
            <User className="w-5 h-5 text-white drop-shadow" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <div
                className="text-[15px] font-semibold text-gray-900 dark:text-gray-200"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                HR Manager
              </div>
              <div
                className="text-xs mt-0.5 text-gray-500 dark:text-gray-400 truncate"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                admin@nexuspro.com
              </div>
            </div>
          )}
        </div>

        {/* Beautiful subtle noise overlay */}
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

export default Sidebar;