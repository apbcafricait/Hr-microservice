import React, { useState } from "react";
import AddEmployee from "./AddEmployee";
import { useGetAllEmployeesQuery } from "../../../slices/employeeSlice";

const EmployeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: employees, error, isLoading, refetch } = useGetAllEmployeesQuery({
    page: currentPage,
    limit,
  });

  // Filter employees locally
  const filteredEmployees = Array.isArray(employees?.data?.employees)
    ? employees.data.employees.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching employees:", error);
    return (
      <p className="text-red-500">
        Error fetching employees.{" "}
        <button onClick={() => refetch()}>Retry</button>
      </p>
    );
  }

  const totalPages = employees?.data?.totalPages || 1;

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const handleDeleteClick = (employee) => {
    setDeleteEmployee(employee);
  };

  const confirmDelete = () => {
    console.log("Deleting employee:", deleteEmployee.id);
    setDeleteEmployee(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="p-2 border rounded w-full max-w-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Position</th>
            <th className="p-3">Email</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          ) : (
            filteredEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
              >
                <td className="p-3">{`${employee.firstName} ${employee.lastName}`}</td>
                <td className="p-3">{employee.position || "N/A"}</td>
                <td className="p-3">{employee.user?.email || "N/A"}</td>
                <td className="p-3">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    onClick={() => handleEditClick(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDeleteClick(employee)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 p-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {deleteEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Are you sure you want to delete {deleteEmployee.firstName} {deleteEmployee.lastName}?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setDeleteEmployee(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddEmployee
              employee={selectedEmployee}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;