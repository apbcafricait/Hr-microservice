import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Calendar,
  ClipboardList,
  ChevronRight,
  Bell,
  ArrowRight,
  Star,
  AlertTriangle,
  CheckCircle,
  Mail,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useClockInMutation,
  useClockOutMutation,
  useGetAttedanceOfEmployeeQuery,
} from "../../../slices/attendanceSlice";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id);
  const employeeId = employee?.data.employee.id;

  const [clockIn] = useClockInMutation();
  const [clockOut] = useClockOutMutation();
  const { data: attendanceRecords, refetch } = useGetAttedanceOfEmployeeQuery(employeeId);

  const quickLaunchItems = [
    {
      title: "Assign Leave",
      icon: Users,
      path: "/admin/assign-leave",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Leave List",
      icon: ClipboardList,
      path: "/admin/leave-list",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Timesheets",
      icon: Clock,
      path: "/admin/time",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Apply Leave",
      icon: Calendar,
      path: "/admin/leave-apply",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const organizationalEvents = [
    {
      id: 1,
      title: "Quarterly Team Meeting",
      date: "2024-01-25 10:00 AM",
      type: "meeting",
      priority: "high"
    },
    {
      id: 2,
      title: "Employee Training Workshop",
      date: "2024-01-26 2:00 PM",
      type: "training",
      priority: "medium"
    },
    {
      id: 3,
      title: "Project Deadline: Q1 Reports",
      date: "2024-01-28",
      type: "deadline",
      priority: "high"
    },
    {
      id: 4,
      title: "Company Town Hall",
      date: "2024-01-30 11:00 AM",
      type: "meeting",
      priority: "medium"
    },
    {
      id: 5,
      title: "Team Building Event",
      date: "2024-02-01 3:00 PM",
      type: "social",
      priority: "low"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Meeting Reminder",
      message: "Team meeting in 30 minutes",
      type: "warning",
      icon: AlertTriangle,
      iconColor: "text-yellow-500"
    },
    {
      id: 2,
      title: "Task Completed",
      message: "Project milestone achieved",
      type: "success",
      icon: CheckCircle,
      iconColor: "text-green-500"
    },
    {
      id: 3,
      title: "Messages to Read",
      message: "You have 3 unread messages",
      type: "info",
      icon: Mail,
      iconColor: "text-blue-500"
    }
  ];

  useEffect(() => {
    if (attendanceRecords?.length > 0) {
      const latestRecord = attendanceRecords[attendanceRecords.length - 1];
      setIsPunchedIn(!latestRecord.clockOut);
      setCurrentAttendanceId(latestRecord.id);
      setPunchTime(new Date(latestRecord.clockIn).toLocaleString());
      calculateWeeklyStats(attendanceRecords);
    } else {
      setWeeklyStats([
        { name: 'Sun', hours: 0 },
        { name: 'Mon', hours: 0 },
        { name: 'Tue', hours: 0 },
        { name: 'Wed', hours: 0 },
        { name: 'Thu', hours: 0 },
        { name: 'Fri', hours: 0 },
        { name: 'Sat', hours: 0 }
      ]);
    }

    // Set current date and day
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, [attendanceRecords]);

  const calculateWeeklyStats = (records) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekStats = days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        name: day,
        hours: 0,
        date: date.toISOString().split('T')[0]
      };
    });

    records.forEach(record => {
      if (record.clockIn && record.clockOut) {
        const clockInDate = new Date(record.clockIn);
        const clockOutDate = new Date(record.clockOut);
        const recordDateStr = clockInDate.toISOString().split('T')[0];

        const dayIndex = weekStats.findIndex(stat => stat.date === recordDateStr);
        if (dayIndex !== -1) {
          const hours = (clockOutDate - clockInDate) / (1000 * 60 * 60);
          weekStats[dayIndex].hours = Number(hours.toFixed(2));
        }
      }
    });

    setWeeklyStats(weekStats);
  };

  const handlePunchToggle = async () => {
    try {
      const currentTime = new Date();
      if (!isPunchedIn) {
        const response = await clockIn({ 
          employeeId, 
          location: "Office",
          clockIn: currentTime.toISOString()
        }).unwrap();
        setIsPunchedIn(true);
        setCurrentAttendanceId(response.attendance.id);
        setPunchTime(currentTime.toLocaleString());
      } else {
        await clockOut({
          id: currentAttendanceId,
          clockOut: currentTime.toISOString()
        }).unwrap();
        setIsPunchedIn(false);
        setCurrentAttendanceId(null);
        setPunchTime(currentTime.toLocaleString());
      }
      refetch();
    } catch (error) {
      console.error('Punch error:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Welcome back, <span className="text-black font-extrabold">{employee?.data.employee.firstName}</span>
                <span className="ml-2">👋</span>
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Your productivity dashboard awaits</p>
              <p className="text-blue-700 mt-3 text-sm sm:text-base font-medium">{currentDate}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePunchToggle}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-white font-semibold ${
                  isPunchedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-colors duration-300 text-sm sm:text-base`}
              >
                {isPunchedIn ? 'Clock Out' : 'Clock In'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Left Section: Weekly Stats and Notifications */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weekly Stats Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center mb-4">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Weekly Attendance Stats
              </h2>

              <div className="h-40 sm:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value) => [`${value} hours`, 'Work Duration']}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Notifications Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center mb-4">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <notification.icon className={`w-5 h-5 mr-3 ${notification.iconColor}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Section: Time Info */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-4"
          >
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Time Info
            </h2>

            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Last Action</p>
                <p className="text-sm sm:text-base font-semibold text-blue-700">{punchTime || 'No records yet'}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-sm sm:text-base font-semibold text-green-700">
                  {isPunchedIn ? 'Currently Working' : 'Not Clocked In'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizationalEvents.map(event => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{event.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickLaunchItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${item.bgColor} rounded-xl p-4 cursor-pointer`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex flex-col items-center">
                  <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.iconColor} mb-2`} />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;