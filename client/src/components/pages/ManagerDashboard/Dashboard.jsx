import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { HiUsers, HiOutlineCash, HiOutlineClipboardList } from "react-icons/hi";
import { useGetOrganisationEmployeesQuery, useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { useGetAllLeaveRequestsOfOrganisationQuery } from "../../../slices/leaveApiSlice";
import { useSelector } from "react-redux";
import AddEmployee from "./AddEmployee";
import Leave from "./Leave";

const Dashboard = () => {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isApproveLeaveOpen, setIsApproveLeaveOpen] = useState(false);
  const [employee, setEmployee] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const organisationId = orgEmpData?.data.employee.organisation.id;
  const employeeId = orgEmpData?.data.employee.id;

  const { data: employees, error: employeesError, isLoading: employeesLoading } = useGetOrganisationEmployeesQuery(organisationId);
  const { data: leaveRequests, error: leaveError, isLoading: leaveLoading } = useGetAllLeaveRequestsOfOrganisationQuery(employeeId);

  const totalEmployees = employees?.data?.employees?.length || 0;
  const totalSalary = employees?.data?.employees?.reduce((acc, emp) => acc + parseFloat(emp.salary), 0) || 0;
  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.length || 0;

  const departmentSalaryData = employees?.data?.employees?.reduce((acc, emp) => {
    const departmentName = emp.department?.name || "Unassigned";
    acc[departmentName] = (acc[departmentName] || 0) + parseFloat(emp.salary);
    return acc;
  }, {}) || {};

  const departmentSalaryArray = Object.keys(departmentSalaryData).length > 0 ?
    Object.keys(departmentSalaryData).map(department => ({
      name: department,
      value: departmentSalaryData[department],
    })) : [];

  const uniqueDepartments = new Set(employees?.data?.employees?.map(emp => emp.department?.name)).size || 0;

  const handleAddEmployeeClick = () => {
    setEmployee(null);
    setIsAddEmployeeOpen(true);
  };

  const handleApproveLeaveClick = () => {
    setIsApproveLeaveOpen(true);
  };

  const handleFormClose = () => {
    setIsAddEmployeeOpen(false);
    setIsApproveLeaveOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Manager Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Employees</h2>
            <p className="text-3xl font-bold text-blue-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : totalEmployees}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineCash className="text-3xl text-green-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Salary</h2>
            <p className="text-3xl font-bold text-green-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : `Ksh ${totalSalary.toLocaleString()}`}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-yellow-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Leave Requests</h2>
            <p className="text-3xl font-bold text-yellow-500">
              {leaveLoading ? "Loading..." : leaveError ? "Error" : totalLeaveRequests}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-purple-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Departments</h2>
            <p className="text-3xl font-bold text-purple-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : uniqueDepartments}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Department Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentSalaryArray}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentSalaryArray.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Salary"]}
                labelFormatter={(label) => label}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Employee Salary Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={employees?.data?.employees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="firstName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleAddEmployeeClick}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105"
          >
            Add Employee
          </button>
          <button
            onClick={handleApproveLeaveClick}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105"
          >
            Approve Leave
          </button>
          <button
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105"
          >
            Start Recruitment
          </button>

        </div>
      </section>

      {/* Add Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto shadow-lg">
            <button
              onClick={handleFormClose}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-full text-2xl font-bold transition duration-200 z-50"
              aria-label="Close modal"
            >
              ×
            </button>
            <AddEmployee onClose={handleFormClose} />
          </div>
        </div>
      )}

      {/* Approve Leave Modal */}
      {isApproveLeaveOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg">
            <button
              onClick={handleFormClose}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-full text-2xl font-bold transition duration-200 z-50"
              aria-label="Close modal"
            >
              ×
            </button>
            <Leave />
          </div>
        </div>
      )}
    </div>
  );
};

// Function to generate a random color for pie chart segments
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default Dashboard;