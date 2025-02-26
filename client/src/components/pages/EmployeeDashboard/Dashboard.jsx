import React from 'react'
import {
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import EmployeeHeader from '../../Layouts/EmployeeHeader';
import { Line, Bar } from 'react-chartjs-2';

const Dashboard = ({ employeeName, ClockIcon, lastCheckIn, TotalLeaveBalances, totalLeaveRequests, attendanceTrendData, attendanceData, chartOptions, paymentData, totalWorkingHours }) => {
  return (
    <div className="flex">
      {/* Sidebar should be separately fixed */}
      <div className="flex-1 min-h-screen bg-gray-50 p-6">
        <EmployeeHeader />
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600">Welcome back, {employeeName}!</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
                  <ClockIcon className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold bg-blue-400 bg-opacity-30 px-2 py-1 rounded-full">
                  {lastCheckIn?.dayName}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{new Date(lastCheckIn?.clockIn).toLocaleString()}</h3>
              <p className="text-blue-100">Last Check-in</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-400 bg-opacity-30 rounded-lg">
                  <CalendarIcon className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold bg-green-400 bg-opacity-30 px-2 py-1 rounded-full">
                  Available
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{TotalLeaveBalances} Days</h3>
              <p className="text-green-100">Leave Balance</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-400 bg-opacity-30 rounded-lg">
                  <DocumentTextIcon className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold bg-purple-400 bg-opacity-30 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{totalLeaveRequests?.length}</h3>
              <p className="text-purple-100">Leave Requests</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-400 bg-opacity-30 rounded-lg">
                  <UserGroupIcon className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold bg-orange-400 bg-opacity-30 px-2 py-1 rounded-full">
                  Team
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">12</h3>
              <p className="text-orange-100">Department Members</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Trend</h3>
              <div className="relative h-64">
                <Line
                  data={attendanceTrendData(attendanceData)}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Clock-In Patterns' } } }}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Overview</h3>
              <div className="relative h-64">
                <Bar
                  data={paymentData}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Monthly Payments' } } }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Working Hours</h3>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <ClockIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{totalWorkingHours}</p>
                  <p className="text-sm text-gray-500">Hours this month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Status</h3>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">5/20</p>
                  <p className="text-sm text-gray-500">Days taken</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h3>
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">3</p>
                  <p className="text-sm text-gray-500">Submitted</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
