import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Building2, UserCircle, LogOut, Settings,
  HelpCircle, Lock, Sun, Moon, ChevronDown, Plus, Building,
  Users2, Network, ListTodo, FileText, BarChart2, Menu as MenuIcon,
} from 'lucide-react';
import User from './User';
import CreateOrganization from './CreateOrganization';
import ViewOrganization from './ViewOrganizations';

const AdminImports = () => {
  const [showUser, setShowUser] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showViewOrg, setShowViewOrg] = useState(false);

  const handleUserClick = () => {
    setShowUser(!showUser);
    setShowCreateOrg(false);
    setShowViewOrg(false);
  };

  const handleCreateOrgClick = () => {
    setShowCreateOrg(!showCreateOrg);
    setShowUser(false);
    setShowViewOrg(false);
  };

  const handleViewOrgClick = () => {
    setShowViewOrg(!showViewOrg);
    setShowUser(false);
    setShowCreateOrg(false);
  };

  const cards = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage system users and their permissions',
      color: 'indigo',
      subItems: [
        { icon: Users2, title: 'User', onClick: handleUserClick },
      ],
    },
    {
      icon: Building,
      title: 'Organization',
      description: 'Manage organizational structure and details',
      color: 'violet',
      subItems: [
        { icon: Plus, title: 'Create Organization', onClick: handleCreateOrgClick, highlight: true },
        { icon: Building, title: 'View Organizations', onClick: handleViewOrgClick, highlight: true },
        { icon: Network, title: 'Departments', path: '/departments' },
        { icon: Users, title: 'Employees', path: '/employees' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => setActiveCard(activeCard === index ? null : index)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100 text-${card.color}-600`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
                <ChevronDown className="w-5 h-5 ml-auto transition-transform" />
              </div>
              <p className="text-sm text-gray-600">
                {card.description}
              </p>
            </div>
            <AnimatePresence>
              {activeCard === index && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    visible: { opacity: 1, height: 'auto' },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="px-6 pb-6 space-y-2"
                >
                  {card.subItems.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-sm hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6"
          >
            <User />
          </motion.div>
        )}
        {showCreateOrg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6"
          >
            <CreateOrganization />
          </motion.div>
        )}
        {showViewOrg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6"
          >
            <ViewOrganization />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminImports;