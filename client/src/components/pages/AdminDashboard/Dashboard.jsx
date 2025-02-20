import React, { useState } from "react";
import {
  Clock,
  Users,
  Calendar,
  ClipboardList,
  ChevronRight,
  Settings,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  // State for punch status and time
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);

  // Sample data for the pie chart
  const distributionData = [
    { name: "Unassigned", value: 97.4, color: "#FF6B6B" },
    { name: "Human Resources", value: 2.6, color: "#FFB067" },
  ];

  // Quick Launch items with clickable functionality (add your routing logic here)
  const quickLaunchItems = [
    { title: "Assign Leave", icon: Users, onClick: () => console.log("Assign Leave clicked") },
    { title: "Leave List", icon: ClipboardList, onClick: () => console.log("Leave List clicked") },
    { title: "Timesheets", icon: Clock, onClick: () => console.log("Timesheets clicked") },
    { title: "Apply Leave", icon: Calendar, onClick: () => console.log("Apply Leave clicked") },
    { title: "My Leave", icon: Calendar, onClick: () => console.log("My Leave clicked") },
    { title: "My Timesheet", icon: Clock, onClick: () => console.log("My Timesheet clicked") },
  ];

  // Function to handle punch in/out
  const handlePunchToggle = () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setPunchTime(`Today at ${currentTime}`);
    setIsPunchedIn(!isPunchedIn);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time at Work Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Time at Work
              </h2>
            </div>

            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer"
                onClick={handlePunchToggle}
              >
                <div
                  className={`w-8 h-8 rounded-full transition-colors duration-200 ${
                    isPunchedIn ? "bg-green-500" : "bg-indigo-500"
                  }`}
                />
              </motion.div>
              <div className="ml-4">
                <h3
                  className={`font-medium cursor-pointer ${
                    isPunchedIn ? "text-green-600" : "text-indigo-600"
                  }`}
                  onClick={handlePunchToggle}
                >
                  {isPunchedIn ? "Punched In" : "Punched Out"}
                </h3>
                <p className="text-sm text-gray-600">
                  {punchTime || "Not recorded yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>1h 5m Today</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-2">This Week</div>
              <div className="text-xs text-gray-500">Feb 17 - Feb 23</div>
              <div className="grid grid-cols-7 gap-2 mt-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="flex flex-col items-center">
                    <div
                      className={`h-20 w-full rounded-md transition-all duration-200 ${
                        i === 0 ? "bg-indigo-500" : "bg-gray-200"
                      }`}
                    />
                    <span className="text-xs mt-1 text-gray-600">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* My Actions Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
              <ClipboardList className="w-5 h-5 mr-2 text-indigo-600" />
              My Actions
            </h2>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-3 bg-red-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <span className="text-sm text-gray-700 font-medium">
                    (1) Pending Self Review
                  </span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-3 bg-blue-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <span className="text-sm text-gray-700 font-medium">
                    (1) Candidate to Interview
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Launch Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
              <ChevronRight className="w-5 h-5 mr-2 text-indigo-600" />
              Quick Launch
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickLaunchItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center mb-2 transition-colors duration-200 hover:bg-indigo-100">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium">
                    {item.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Employee Distribution by Sub Unit
              </h2>
              <motion.div whileHover={{ rotate: 90 }}>
                <Settings className="w-5 h-5 text-gray-500 cursor-pointer" />
              </motion.div>
            </div>

            <div className="flex flex-col items-center md:flex-row md:justify-center gap-6">
              <PieChart width={200} height={200}>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-4">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;