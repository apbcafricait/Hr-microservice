import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Home, Lightbulb, Gift, PieChart, DollarSign, BookOpen, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Features', path: '#features', icon: Lightbulb },
    { name: 'Benefits', path: '#benefits', icon: Gift },
    { name: 'Pricing', path: '#pricing', icon: DollarSign },
    { name: 'Contact', path: '#contact', icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed w-full top-0 z-50 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-white dark:bg-gray-900'
      } transition-all duration-300`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.a
              href="/"
              className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NEXUS
            </motion.a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-8">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.path}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-lg">{item.name}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Sign Up Button */}
            <motion.button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="h-5 w-5" />
              <span>Sign Up</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={index}
                      href={item.path}
                      className="flex items-center space-x-2 px-4 py-3 rounded-md text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </motion.a>
                  );
                })}
                <motion.button
                  onClick={() => navigate('/register')}
                  className="w-full mt-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-200 flex items-center justify-center space-x-2 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign Up</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;