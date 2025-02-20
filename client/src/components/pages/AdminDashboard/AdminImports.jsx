import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building,
  Users2,
  Network,
  Plus,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
} from "lucide-react";
import User from "./User";
import CreateOrganization from "./CreateOrganization";
import ViewOrganization from "./ViewOrganizations";

const AdminImports = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [showUser, setShowUser] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showViewOrg, setShowViewOrg] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      title: "User Management",
      description: "Manage system users, roles, permissions, and access controls.",
      color: "indigo",
      gradient: "from-indigo-50 to-blue-50",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      hoverColor: "hover:bg-indigo-100",
      subItems: [
        { icon: Users2, title: "Manage Users", onClick: handleUserClick },
      ],
    },
    {
      icon: Building,
      title: "Organization",
      description: "Configure and manage organizational structure and departments.",
      color: "purple",
      gradient: "from-purple-50 to-indigo-50",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      hoverColor: "hover:bg-purple-100",
      subItems: [
        { icon: Plus, title: "Create Organization", onClick: handleCreateOrgClick },
        { icon: Building, title: "View Organizations", onClick: handleViewOrgClick },
        { icon: Network, title: "Departments", onClick: () => {} },
        { icon: Users, title: "Employees", onClick: () => {} },
      ],
    },
  ];

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl md:text-4xl font-semibold text-gray-800"
            >
              Admin 
            </motion.h1>
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-medium text-indigo-600">Admin</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {filteredCards.length > 0 ? (
            filteredCards.map((card, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border ${card.borderColor}`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setActiveCard(activeCard === index ? null : index)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-lg ${card.bgColor} ${card.textColor}`}
                    >
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {card.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeCard === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${card.textColor}`} />
                    </motion.div>
                  </div>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>

                <AnimatePresence>
                  {activeCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 space-y-3"
                    >
                      {card.subItems.map((item, itemIndex) => (
                        <motion.button
                          key={itemIndex}
                          whileHover={{ x: 5, backgroundColor: card.hoverColor }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.onClick}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 transition-colors duration-200`}
                        >
                          <item.icon className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{item.title}</span>
                          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No modules found matching your search.
            </div>
          )}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {showUser && (
            <motion.div
              key="user"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white rounded-xl shadow-md p-6 md:p-8"
            >
              <User />
            </motion.div>
          )}
          {showCreateOrg && (
            <motion.div
              key="createOrg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white rounded-xl shadow-md p-6 md:p-8"
            >
              <CreateOrganization />
            </motion.div>
          )}
          {showViewOrg && (
            <motion.div
              key="viewOrg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white rounded-xl shadow-md p-6 md:p-8"
            >
              <ViewOrganization />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminImports;