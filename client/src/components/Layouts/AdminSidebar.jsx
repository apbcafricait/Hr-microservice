import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Shield
} from 'lucide-react';

const Sidebar = ({ activeLink, setActiveLink }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredLink, setHoveredLink] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Admin', icon: Shield },
    { name: 'Employees', icon: Users },
    { name: 'Leave', icon: Calendar },
    { name: 'Recruitment', icon: UserPlus },
    { name: 'Performance', icon: BarChart2 },
    { name: "Payroll", icon: BarChart2 },
    { name: 'Time', icon: Clock },
    { name: 'My Info', icon: User },
    { name: 'Claims', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ width: isExpanded ? 256 : 80 }}
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative h-screen bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transition-all duration-300"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 text-purple-700 shadow-lg hover:bg-gray-100 focus:outline-none z-50"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Logo Section */}
      <div className={`p-6 ${isExpanded ? 'px-6' : 'px-4'}`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md">
            <Award className="w-6 h-6 text-purple-700" />
          </div>
          {isExpanded && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-white"
            >
              Nexus Pro
            </motion.h1>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-4 mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeLink === item.name;
            return (
              <motion.li key={item.name}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(item.name);
                  }}
                  onMouseEnter={() => setHoveredLink(item.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-white text-purple-700 shadow-md'
                      : 'text-white hover:bg-white hover:text-purple-700'
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive
                        ? 'text-purple-700'
                        : 'text-white group-hover:text-purple-700'
                    }`}
                  />
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </a>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
