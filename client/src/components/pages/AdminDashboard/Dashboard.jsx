import React, { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Calendar,
  ClipboardList,
  ChevronRight,
  Settings,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { 
  useClockInMutation, 
  useClockOutMutation, 
  useGetAttedanceOfEmployeeQuery 
} from '../../../slices/attendanceSlice';
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";

const Dashboard = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);
  const employeeId = employee?.data.employee.id;
  console.log(employeeId)
  // API hooks
  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();
  const { data: attendanceRecords, refetch } = useGetAttedanceOfEmployeeQuery(employeeId); 
 

  // Sample data for the pie chart
  const distributionData = [
    { name: "Unassigned", value: 97.4, color: "#FF6B6B" },
    { name: "Human Resources", value: 2.6, color: "#FFB067" },
  ];

  // Quick Launch items
  const quickLaunchItems = [
    { title: "Assign Leave", icon: Users, onClick: () => console.log("Assign Leave clicked") },
    { title: "Leave List", icon: ClipboardList, onClick: () => console.log("Leave List clicked") },
    { title: "Timesheets", icon: Clock, onClick: () => console.log("Timesheets clicked") },
    { title: "Apply Leave", icon: Calendar, onClick: () => console.log("Apply Leave clicked") },
    { title: "My Leave", icon: Calendar, onClick: () => console.log("My Leave clicked") },
    { title: "My Timesheet", icon: Clock, onClick: () => console.log("My Timesheet clicked") },
  ];

  // Check latest attendance status on mount and after refetch
  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
      const latestRecord = attendanceRecords.reduce((latest, current) => {
        return new Date(current.clockIn) > new Date(latest.clockIn) ? current : latest;
      });
      
      if (latestRecord.clockOut === null) {
        setIsPunchedIn(true);
        setCurrentAttendanceId(latestRecord.id);
        setPunchTime(new Date(latestRecord.clockIn).toLocaleString());
      } else {
        setIsPunchedIn(false);
        setCurrentAttendanceId(null);
        setPunchTime(new Date(latestRecord.clockOut).toLocaleString());
      }
    }
  }, [attendanceRecords]);

  // Calculate weekly hours
  const getWeeklyHours = () => {
    if (!attendanceRecords) return [];
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = days.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      
      const dayRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.clockIn);
        return recordDate.toDateString() === dayDate.toDateString() && record.clockOut;
      });
      
      const hours = dayRecords.reduce((sum, record) => {
        const duration = (new Date(record.clockOut) - new Date(record.clockIn)) / (1000 * 60 * 60);
        return sum + duration;
      }, 0);
      
      return { name: day, hours: Number(hours.toFixed(1)) };
    });
    
    return weeklyData;
  };

  const weeklyHoursData = getWeeklyHours();

  const handlePunchToggle = async () => {
    try {
      const currentTime = new Date();
      if (!isPunchedIn) {
        const response = await clockIn({
          employeeId,
          location: "Office"
        }).unwrap();
        setIsPunchedIn(true);
        setCurrentAttendanceId(response.attendance.id);
        setPunchTime(currentTime.toLocaleString());
      } else {
        await clockOut(currentAttendanceId).unwrap();
        setIsPunchedIn(false);
        setCurrentAttendanceId(null);
        setPunchTime(currentTime.toLocaleString());
      }
      refetch();
    } catch (error) {
      console.error('Punch error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time at Work Card */}
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-indigo-600" />
                Time at Work
              </h2>
            </div>

            <div className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePunchToggle}
                disabled={isClockingIn || isClockingOut}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isPunchedIn ? 'bg-green-100' : 'bg-indigo-100'
                } ${isClockingIn || isClockingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full ${
                  isPunchedIn ? 'bg-green-500' : 'bg-indigo-500'
                } transition-colors duration-300`}></div>
              </motion.button>
              <div className="ml-4">
                <h3 className={`text-lg font-medium ${
                  isPunchedIn ? 'text-green-600' : 'text-indigo-600'
                }`}>
                  {isPunchedIn ? 'Punched In' : 'Punched Out'}
                </h3>
                <p className="text-sm text-gray-600">
                  {punchTime || 'Not recorded yet'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-3">This Week's Hours</div>
              <div className="h-40 w-full">
                <ResponsiveContainer>
                  <BarChart data={weeklyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      formatter={(value) => [`${value} hours`, 'Hours']}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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