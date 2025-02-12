import  { useState } from 'react';
import {
  useGetAllEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '../../../slices/employeeSlice';

const EmployeeList = () => {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    jobTitle: '',
    employmentStatus: '',
    subUnit: '',
    supervisor: ''
  });

  // Fetch all employees
  const { data: employees, refetch } = useGetAllEmployeesQuery({ page: 1, limit: 10, organisationId: 'yourOrganisationId', search: '' });

  // Create a new employee
  const [createEmployee] = useCreateEmployeeMutation();

  // Delete an employee
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      await createEmployee(newEmployee).unwrap();
      refetch(); // Refresh the list
      setNewEmployee({
        name: '',
        employeeId: '',
        jobTitle: '',
        employmentStatus: '',
        subUnit: '',
        supervisor: ''
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId).unwrap();
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>Job Title</th>
            <th>Employment Status</th>
            <th>Sub Unit</th>
            <th>Supervisor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee.employeeId}>
              <td>{employee.name}</td>
              <td>{employee.employeeId}</td>
              <td>{employee.jobTitle}</td>
              <td>{employee.employmentStatus}</td>
              <td>{employee.subUnit}</td>
              <td>{employee.supervisor}</td>
              <td>
                <button onClick={() => handleRemoveEmployee(employee.employeeId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Employee</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={newEmployee.employeeId}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={newEmployee.jobTitle}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="employmentStatus"
          placeholder="Employment Status"
          value={newEmployee.employmentStatus}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="subUnit"
          placeholder="Sub Unit"
          value={newEmployee.subUnit}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="supervisor"
          placeholder="Supervisor"
          value={newEmployee.supervisor}
          onChange={handleInputChange}
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
    </div>
  );
};

export default EmployeeList;