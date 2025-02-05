import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from '@headlessui/react';
import { 
  Users, 
  Briefcase, 
  Building2, 
  UserCircle, 
  LogOut, 
  Settings, 
  HelpCircle, 
  Lock,
  Sun,
  Moon
} from 'lucide-react';

const AdminDashboard = () => {
  const [theme, setTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    }`}>
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>

              {/* Profile Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <UserCircle className={`w-6 h-6 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`} />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {[
                      { icon: Settings, text: 'Settings' },
                      { icon: HelpCircle, text: 'Support' },
                      { icon: Lock, text: 'Change Password' },
                      { icon: LogOut, text: 'Logout' }
                    ].map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`${
                              active 
                                ? 'bg-gray-100 dark:bg-gray-700' 
                                : ''
                            } flex items-center px-4 py-2 text-sm ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.text}
                          </a>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: Users, 
              title: 'User Management',
              description: 'Manage system users and their permissions',
              items: ['View Users', 'Add User', 'User Roles']
            },
            {
              icon: Briefcase,
              title: 'Jobs',
              description: 'Handle job postings and applications',
              items: ['Job Listings', 'Applications', 'Statistics']
            },
            {
              icon: Building2,
              title: 'Organization',
              description: 'Manage organizational structure and details',
              items: ['Company Info', 'Departments', 'Employees']
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-6 ${
                theme === 'light'
                  ? 'bg-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-800 shadow-gray-700/30 hover:shadow-gray-700/40'
              } transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${
                  theme === 'light'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-blue-900/30 text-blue-400'
                }`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-semibold ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {card.title}
                </h3>
              </div>
              
              <p className={`text-sm mb-4 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {card.description}
              </p>

              <div className="space-y-2">
                {card.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      theme === 'light'
                        ? 'hover:bg-gray-50 text-gray-700'
                        : 'hover:bg-gray-700 text-gray-300'
                    } transition-colors`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;