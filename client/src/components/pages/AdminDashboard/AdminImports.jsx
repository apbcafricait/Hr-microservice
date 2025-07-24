import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users2,
  Building,
  Network,
  Plus,
  Search,
  ChevronRight,
  Settings,
  Shield,
} from "lucide-react";
import User from "./User";
import CreateOrganization from "./CreateOrganization";
import ViewOrganization from "./ViewOrganizations";

const AdminImports = () => {
  const [activeSection, setActiveSection] = useState("manage-users");
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    {
      icon: Users2,
      title: "Manage Users",
      id: "manage-users",
      component: User,
    },
   
    {
      icon: Building,
      title: "View My Organization",
      id: "view-org",
      component: ViewOrganization,
    },
    {
      icon: Network,
      title: "Departments",
      id: "departments",
      component: () => (
        <div className="text-slate-600">Departments Component (Under Development)</div>
      ),
    },
  ];

  // Filter navigation items based on search query
  const filteredItems = navigationItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveComponent = navigationItems.find(
    (item) => item.id === activeSection
  )?.component;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans antialiased"
    >
      {/* Header and Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex items-center"
            >
              <Shield className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                Admin Portal
              </h1>
            </motion.div>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 text-slate-700 placeholder-slate-400"
                aria-label="Search modules"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-2 pb-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  aria-label={`Navigate to ${item.title}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </motion.button>
              ))
            ) : (
              <div className="text-slate-500 py-2.5 px-4 bg-slate-50 rounded-lg border border-slate-200">
                No modules match your search
              </div>
            )}
          </nav>

          {/* Breadcrumb */}
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span className="font-medium text-indigo-600">Admin</span>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
            <span className="font-medium text-slate-700">
              {navigationItems.find((item) => item.id === activeSection)?.title || "Module"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md border border-slate-100 p-6 sm:p-8"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800">
                {navigationItems.find((item) => item.id === activeSection)?.title || "Module"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Active Component */}
            {ActiveComponent ? (
              <ActiveComponent />
            ) : (
              <div className="text-slate-500 text-center py-10 px-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100"
                >
                  <Search className="h-8 w-8 text-slate-400" />
                </motion.div>
                <p className="text-lg">Select a module to view content</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default AdminImports;