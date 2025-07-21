import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock8,
  User,
  Briefcase,
  Calendar,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useGetEmployeeQuery, useGetOrganisationEmployeesQuery } from "../../../slices/employeeSlice";
import { useGetOrganisationByIdQuery } from "../../../slices/organizationSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Sample task data (replace with API integration)
const initialTasks = [
  { id: "1", title: "Leave Request - John Doe", status: "pending", dueDate: "2025-07-25" },
  { id: "2", title: "Leave Request - Jane Smith", status: "pending", dueDate: "2025-07-22" },
];

// Utility to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading: empLoading, error: empError } = useGetEmployeeQuery(id);
  const employeeId = employee?.data.employee.id;
  const organisationId = employee?.data.employee.organisationId;
  const { data: employees, isLoading: empListLoading } = useGetOrganisationEmployeesQuery(organisationId);
  const { data: organisation, isLoading: orgLoading } = useGetOrganisationByIdQuery(organisationId);

  // State for theme and draggable widgets
  const [theme, setTheme] = useState("light");
  const [widgets, setWidgets] = useState([
    { id: "subscription", component: "SubscriptionStatus" },
    { id: "employees", component: "TotalEmployees" },
    { id: "organization", component: "OrganizationDetails" },
    { id: "contact", component: "ContactInfo" },
  ]);
  const [tasks, setTasks] = useState(initialTasks);

  // // Theme toggle
  // const toggleTheme = () => {
  //   setTheme(theme === "light" ? "dark" : "light");
  // };

  // Drag-and-drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedWidgets = Array.from(widgets);
    const [movedWidget] = reorderedWidgets.splice(result.source.index, 1);
    reorderedWidgets.splice(result.destination.index, 0, movedWidget);
    setWidgets(reorderedWidgets);
  };

  // Auto-approve tasks due in the past
  useEffect(() => {
    const today = new Date();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        new Date(task.dueDate) < today && task.status === "pending"
          ? { ...task, status: "approved" }
          : task
      )
    );
  }, []);

  // Send reminders for pending tasks (mock implementation)
  useEffect(() => {
    const reminders = tasks.filter(
      (task) => task.status === "pending" && new Date(task.dueDate) <= new Date()
    );
    if (reminders.length > 0) {
      console.log("Reminder: Pending tasks", reminders);
      // Replace with actual notification logic (e.g., API call)
    }
  }, [tasks]);

  // Subscription status helpers
  const getSubscriptionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "trial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "expired":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "trial":
        return <Clock8 className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  // Employee distribution data
  const getEmployeeDistributionData = () => {
    if (!organisation?.data?.organisation?._count?.employees) return [];
    return [
      {
        name: "Total Employees",
        value: organisation.data.organisation._count.employees,
        color: "#4F46E5",
      },
    ];
  };

  const distributionData = getEmployeeDistributionData();

  // Widget components
  const widgetComponents = {
    SubscriptionStatus: (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          {getSubscriptionStatusIcon(organisation?.data?.organisation?.subscriptionStatus)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(
              organisation?.data?.organisation?.subscriptionStatus
            )}`}
          >
            {organisation?.data?.organisation?.subscriptionStatus?.toUpperCase() || "N/A"}
          </span>
        </div>
        <h3 className="text-xl font-semibold mt-4">Subscription Status</h3>
        <p className="text-sm text-gray-600 mt-1">Current plan status</p>
      </motion.div>
    ),
    TotalEmployees: (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          <User className="w-5 h-5 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">
            {organisation?.data?.organisation?._count?.employees || 0}
          </span>
        </div>
        <h3 className="text-xl font-semibold mt-4">Total Employees</h3>
        <p className="text-sm text-gray-600 mt-1">Active members</p>
      </motion.div>
    ),
    OrganizationDetails: (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          <Building className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">Details</span>
        </div>
        <h3 className="text-xl font-semibold mt-4">{organisation?.data?.organisation?.name || "N/A"}</h3>
        <p className="text-sm text-gray-600 mt-1">Organization Name</p>
      </motion.div>
    ),
    ContactInfo: (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          <Phone className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Contact</span>
        </div>
        <h3 className="text-xl font-semibold mt-4">M-Pesa</h3>
        <p className="text-sm text-gray-600 mt-1">{organisation?.data?.organisation?.mpesaPhone || "N/A"}</p>
      </motion.div>
    ),
  };

  if (empLoading || orgLoading || empListLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (empError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">Error: {empError.message}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gray-900 text-white"} py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-poppins`}>
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center rounded-b-xl"
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{userInfo?.name}</span>
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.button> */}
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-6"
      >
        {/* Draggable Widgets */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="widgets" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
              >
                {widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {widgetComponents[widget.component]}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee Distribution */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Employee Distribution
              </h2>
            </div>
            <div className="flex flex-col items-center md:flex-row md:justify-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "light" ? "#fff" : "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-4">
                {distributionData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}: {item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Employees */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-6">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Employees
            </h2>
            <div className="space-y-4">
              {employees?.data?.employees?.slice(0, 5).map((emp) => (
                <Link to={`/employee/${emp.id}`} key={emp.id} className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: theme === "light" ? "#F9FAFB" : "#374151" }}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{emp.firstName} {emp.lastName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">{emp.position}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(emp.employmentDate)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Task Management */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-6">
              <Bell className="w-5 h-5 mr-2 text-yellow-600" />
              Task Management
            </h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${
                    task.status === "approved" ? "bg-green-50 dark:bg-green-900" : "bg-yellow-50 dark:bg-yellow-900"
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{task.title}</h3>
                      <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        task.status === "approved" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;