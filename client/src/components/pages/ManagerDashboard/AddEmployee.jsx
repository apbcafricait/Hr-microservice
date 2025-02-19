import React, { useState, useEffect } from "react";
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "../../../slices/employeeSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEmployee = ({ employee, onClose }) => {
  const defaultEmployeeData = {
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
    role: "employee",
    organisationId: 1,
  };

  const [employeeData, setEmployeeData] = useState(defaultEmployeeData);
  const [formErrors, setFormErrors] = useState({});

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (employee) {
      setEmployeeData(employee);
    }
  }, [employee]);

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!/^\d+$/.test(employeeData.salary)) {
      errors.salary = "Salary must be a number";
    }
    if (employeeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (employee) {
        await updateEmployee({ id: employee.id, ...employeeData }).unwrap();
        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(employeeData).unwrap();
        toast.success("Employee added successfully!");
        setEmployeeData(defaultEmployeeData); // Reset form for new employee
      }
      setFormErrors({});
      onClose(); // Close the form
    } catch (err) {
      const errorMessage = err?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {employee ? "Edit Employee" : "Add Employee"}
      </h2>

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
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "National ID", name: "nationalId", type: "text" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Position", name: "position", type: "text" },
          { label: "Employment Date", name: "employmentDate", type: "date" },
          { label: "Salary", name: "salary", type: "number" },
          { label: "Email", name: "email", type: "email" },
          { label: "Username", name: "username", type: "text" },
          { label: "Password", name: "password", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-medium mb-1">
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              value={employeeData[name]}
              onChange={handleChange}
              required={name !== "password"} // Password can be optional for updates
              className="border border-gray-300 rounded px-2 py-1"
            />
            {formErrors[name] && <p className="text-red-500">{formErrors[name]}</p>}
          </div>
        ))}

        {/* Role Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="role" className="text-sm font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {employee ? "Update Employee" : "Save Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
