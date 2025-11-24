import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Home, Lightbulb, Gift, PieChart, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => { 
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Features", path: "/features", icon: Lightbulb },
    { name: "Benefits", path: "/benefits", icon: Gift },
    { name: "Pricing", path: "/pricing", icon: PieChart },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed w-full top-0 z-50 ${
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white"
      } transition-all duration-300 font-lato`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <button
              onClick={() => handleNavigate("/")}
              className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
            >
              NEXUS
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-2 bg-white shadow-lg">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleNavigate(item.path)}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 w-full text-left"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
                <div className="px-4 py-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 justify-center"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
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