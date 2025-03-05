import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Home, Lightbulb, Gift, PieChart, DollarSign, BookOpen, Mail, } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Features", path: "#features", icon: Lightbulb },
    { name: "Benefits", path: "#benefits", icon: Gift },
    { name: "Pricing", path: "#pricing", icon: PieChart },
    { name: "Contact", path: "#contact", icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed w-full top-0 z-50 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md"
          : "bg-white"
      } transition-all duration-300`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <a
              href="/"
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
            >
              NEXUS
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 text-sm md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Search and Sign Up */}
            <div className="flex items-center space-x-4">
              
              <motion.button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
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
              <div className="px-2 pt-2 pb-3 space-y-2 bg-white shadow-lg">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={index}
                      onClick={() => handleNavigate(item.path)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 font-medium transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </motion.a>
                  );
                })}
                <div className="px-4 py-3">
                  
                  <motion.button
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign Up</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;