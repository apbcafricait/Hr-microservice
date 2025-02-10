import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Moon,
  ChevronDown,
  Plus,
  Building,
  Users2,
  Network,
  ListTodo,
  FileText,
  BarChart2,
  Menu as MenuIcon,
} from 'lucide-react';
import AdminSidebar from '../../Layouts/AdminSidebar';
import User from './User';
const AdminDashboard = () => {
  const [theme, setTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  const cards = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage system users and their permissions',
      color: 'indigo',
      subItems: [
        { icon: Users2, title: 'Users', path: '/users' },
      ],
    },
    {
      icon: Briefcase,
      title: 'Jobs',
      description: 'Handle job postings and applications',
      color: 'emerald',
      subItems: [
        { icon: ListTodo, title: 'Job Listings', path: '/jobs' },
        { icon: FileText, title: 'Applications', path: '/applications' },
        { icon: BarChart2, title: 'Statistics', path: '/job-stats' },
      ],
    },
    {
      icon: Building2,
      title: 'Organization',
      description: 'Manage organizational structure and details',
      color: 'violet',
      subItems: [
        { icon: Plus, title: 'Create Organization', path: '/admin/create-organization', highlight: true },
        { icon: Building, title: 'View Organizations', path: '/admin/view-organization', highlight: true },
        { icon: Network, title: 'Departments', path: '/departments' },
        { icon: Users, title: 'Employees', path: '/employees' },
      ],
    },
  ];

  return (
    <div className={`min-h-screen flex ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-1 transition-colors duration-300">
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Admin Portal
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                </button>

                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <UserCircle className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {[
                        { icon: Settings, text: 'Settings', desc: 'Manage your preferences' },
                        { icon: HelpCircle, text: 'Support', desc: 'Get help' },
                        { icon: Lock, text: 'Security', desc: 'Update password' },
                        { icon: LogOut, text: 'Logout', desc: 'Sign out of account' },
                      ].map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <a
                              href="#"
                              className={`${
                                active ? 'bg-gray-50 dark:bg-gray-700' : ''
                              } flex items-center px-4 py-3 transition-colors`}
                            >
                              <item.icon className={`w-5 h-5 mr-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                              <div>
                                <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                  {item.text}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
                              </div>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl ${
                  theme === 'light'
                    ? 'bg-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-800 shadow-gray-700/30 hover:shadow-gray-700/40'
                } transition-all duration-300`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setActiveCard(activeCard === index ? null : index)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {card.title}
                    </h3>
                    <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${activeCard === index ? 'rotate-180' : ''}`} />
                  </div>

                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {card.description}
                  </p>
                </div>

                <AnimatePresence>
                  {activeCard === index && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-6 pb-6 space-y-2"
                    >
                      {card.subItems.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.path}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm ${
                            item.highlight
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                              : theme === 'light'
                              ? 'hover:bg-gray-50 text-gray-700'
                              : 'hover:bg-gray-700 text-gray-300'
                          } transition-colors`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;