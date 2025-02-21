// src/components/layouts/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const employeeName = userInfo.firstName || 'Employee';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed w-full top-0 z-50 ${scrolled ? 'bg-gray-800/80 backdrop-blur-lg shadow-lg' : 'bg-gray-800'} text-white transition-all duration-300`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <motion.h1
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
            </motion.h1>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <span className="text-lg">Welcome, {employeeName}</span>
            <div className="relative">
              <motion.button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-white hover:bg-blue-500 rounded-md px-3 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5" />
                <span>Menu</span>
                <ChevronDown className="h-4 w-4" />
              </motion.button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20">
                  <motion.button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Profile
                  </motion.button>
                  <motion.button
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    About
                  </motion.button>
                  <motion.button
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Password
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Log Out
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-2">
              <motion.div className="px-4 py-2 text-lg text-white">
                Welcome, {employeeName}
              </motion.div>
              <motion.button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="h-5 w-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default EmployeeHeader;