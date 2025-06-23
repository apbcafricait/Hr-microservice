import React from "react";
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
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useGetEmployeeQuery, useGetOrganisationEmployeesQuery } from "../../../slices/employeeSlice";
import { useGetOrganisationByIdQuery } from "../../../slices/organizationSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: employee } = useGetEmployeeQuery(id);
  const employeeId = employee?.data.employee.id;
  const organisationId = employee?.data.employee.organisationId;
  const { data: employees } = useGetOrganisationEmployeesQuery(organisationId);
  const { data: organisation } = useGetOrganisationByIdQuery(organisationId);

  const getSubscriptionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'trial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trial':
        return <Clock8 className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEmployeeDistributionData = () => {
    if (!organisation?.data?.organisation?._count?.employees) return [];
    return [
      {
        name: "Total Employees",
        value: organisation.data.organisation._count.employees,
        color: "#4F46E5"
      }
    ];
  };

  const distributionData = getEmployeeDistributionData();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight font-poppins">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              {getSubscriptionStatusIcon(organisation?.data?.organisation?.subscriptionStatus)}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(organisation?.data?.organisation?.subscriptionStatus)}`}>
                {organisation?.data?.organisation?.subscriptionStatus?.toUpperCase() || 'N/A'}
              </span>
            </div>
            <h3 className="text-xl font-semibold mt-4">Subscription Status</h3>
            <p className="text-sm text-gray-600 mt-1">Current plan status</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {organisation?.data?.organisation?._count?.employees || 0}
              </span>
            </div>
            <h3 className="text-xl font-semibold mt-4">Total Employees</h3>
            <p className="text-sm text-gray-600 mt-1">Active members</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <Building className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Details</span>
            </div>
            <h3 className="text-xl font-semibold mt-4">{organisation?.data?.organisation?.name || 'N/A'}</h3>
            <p className="text-sm text-gray-600 mt-1">Organization Name</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Contact</span>
            </div>
            <h3 className="text-xl font-semibold mt-4">M-Pesa</h3>
            <p className="text-sm text-gray-600 mt-1">{organisation?.data?.organisation?.mpesaPhone || 'N/A'}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Employee Distribution
              </h2>
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
                <Tooltip />
              </PieChart>
              <div className="flex flex-col gap-4">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700 font-medium">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Employees
            </h2>

            <div className="space-y-4">
              {employees?.data?.employees?.slice(0, 5).map((emp) => (
                <Link to={`/employee/${emp.id}`} key={emp.id} className="block">
                  <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</h3>
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
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;