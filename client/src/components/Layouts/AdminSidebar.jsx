import React, { useState, useEffect } from 'react';
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
  Briefcase,
  X
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Home, description: 'Overview & Analytics' },
  { name: 'Admin', icon: Shield, description: 'System Administration' },
  { name: 'Employees', icon: Users, description: 'Manage Team Members' },
  { name: 'Leave', icon: Calendar, description: 'Leave Management' },
  { name: 'Recruitment', icon: UserPlus, description: 'Hiring & Onboarding' },
  { name: 'Performance', icon: BarChart2, description: 'Reviews & Metrics' },
  { name: "Payroll", icon: DollarSign, description: 'Salary & Benefits' },
  { name: 'Time', icon: Clock, description: 'Time Tracking' },
  { name: 'My Info', icon: User, description: 'Personal Information' },
  { name: 'Claims', icon: ClipboardList, description: 'Expense Claims' },
  { name: 'Settings', icon: Settings, description: 'System Settings' },
];

const iconColors = [
  'text-blue-500',
  'text-indigo-500',
  'text-purple-500',
  'text-pink-500',
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500'
];

const AdminSidebar = ({ isOpen, onClose, activeLink, setActiveLink }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Close sidebar on mobile when link is clicked
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    if (window.innerWidth < 1024) { // lg breakpoint
      onClose?.();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed lg:relative top-0 left-0 h-full z-50
          bg-white border-r border-gray-200 shadow-2xl
          flex flex-col
          font-sans
          ${isOpen ? 'w-80' : 'w-0'} lg:w-72
          overflow-hidden
        `}
      >
        {/* Header with Close Button (Mobile) */}
        <div className="flex items-center justify-between p-6 pb-4 lg:hidden">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">
              Nexus Pro
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center p-6 pb-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 text-xl font-bold text-gray-900"
                >
                  Nexus Pro
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </motion.div>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 mb-4 border-b border-gray-200" />

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeLink === item.name;
              const isHovered = hoveredLink === item.name;
              
              const iconColor = isActive
                ? 'text-white'
                : isHovered
                  ? 'text-blue-600'
                  : iconColors[idx % iconColors.length];

              const iconBg = isActive
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                : isHovered
                  ? 'bg-blue-50'
                  : 'bg-gray-50';

              return (
                <motion.li key={item.name} layout>
                  <button
                    onClick={() => handleLinkClick(item.name)}
                    onMouseEnter={() => setHoveredLink(item.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`
                      group relative flex items-center w-full px-3 py-3
                      rounded-lg transition-all duration-200 outline-none
                      cursor-pointer select-none
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    `}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <span
                      className={`
                        flex items-center justify-center w-9 h-9 mr-3 transition-all duration-200
                        rounded-lg ${iconBg}
                        ${isActive ? 'shadow-lg' : 'shadow-sm'}
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
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.18 }}
                          className="flex-1 text-left"
                        >
                          <div className={`
                            font-medium text-sm
                            ${isActive ? 'text-white' : 'text-gray-900'}
                            transition-colors
                          `}>
                            {item.name}
                          </div>
                          <div className={`
                            text-xs mt-0.5
                            ${isActive ? 'text-blue-100' : 'text-gray-500'}
                            transition-colors
                          `}>
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full bg-white shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className={`
            flex items-center gap-3
            ${isExpanded ? 'flex-row' : 'flex-col'}
          `}>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    HR Manager
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    admin@nexuspro.com
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;