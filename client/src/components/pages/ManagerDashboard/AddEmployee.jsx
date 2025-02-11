import React, { useState } from "react";
import { useCreateEmployeeMutation } from "../../../slices/employeeSlice";

const AddEmployee = ({ onClose }) => {
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    position: "",
    employmentDate: "",
    salary: "",
    email: "",
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [createEmployee] = useCreateEmployeeMutation();

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate salary as a number
    if (!/^\d+$/.test(employeeData.salary)) {
      errors.salary = "Salary must be a number";
    }

    // Validate email format
    if (
      employeeData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)
    ) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createEmployee(employeeData).unwrap();
      setEmployeeData({
        firstName: "",
        lastName: "",
        nationalId: "",
        dateOfBirth: "",
        position: "",
        employmentDate: "",
        salary: "",
        email: "",
        username: "",
        password: "",
      });
      setFormErrors({});
      onClose(); // Close the form on successful submission
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

      {/* Display validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="text-red-500 mb-4">
          {Object.values(formErrors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="text-sm font-medium mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={employeeData.firstName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={employeeData.lastName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* National ID */}
        <div className="flex flex-col">
          <label htmlFor="nationalId" className="text-sm font-medium mb-1">
            National ID
          </label>
          <input
            id="nationalId"
            type="text"
            name="nationalId"
            value={employeeData.nationalId}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label htmlFor="dateOfBirth" className="text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={employeeData.dateOfBirth}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Position */}
        <div className="flex flex-col">
          <label htmlFor="position" className="text-sm font-medium mb-1">
            Position
          </label>
          <input
            id="position"
            type="text"
            name="position"
            value={employeeData.position}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Employment Date */}
        <div className="flex flex-col">
          <label htmlFor="employmentDate" className="text-sm font-medium mb-1">
            Employment Date
          </label>
          <input
            id="employmentDate"
            type="date"
            name="employmentDate"
            value={employeeData.employmentDate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col">
          <label htmlFor="salary" className="text-sm font-medium mb-1">
            Salary
          </label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={employeeData.salary}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={employeeData.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={employeeData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          Save Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;