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
    { name: 'PIM', icon: Users },
    { name: 'Leave', icon: Calendar },
    { name: 'Recruitment', icon: UserPlus },
    { name: 'Performance', icon: BarChart2 },
    { name: "Payroll",  icon: BarChart2 },
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
      className="relative h-screen bg-white border-r border-gray-200 shadow-lg"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-purple-600 rounded-full p-1.5 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 z-50"
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
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
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
                  className={`relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
                    ${activeLink === item.name
                      ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      activeLink === item.name ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'
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

                  {/* Hover Effect */}
                  {hoveredLink === item.name && !activeLink === item.name && (
                    <motion.div
                      layoutId="hoverBackground"
                      className="absolute inset-0 bg-gray-50 rounded-lg -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
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