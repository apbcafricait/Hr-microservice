import  { useState } from 'react';

const Input = ({ label, type, name, value, onChange, required }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-1 font-bold">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border rounded w-full"
      required={required}
    />
  </div>
);

const ManagerDashboard = ({ employees = [], addEmployee = () => {}, removeEmployee = () => {} }) => {
  const [showForm, setShowForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    position: '',
    employmentDate: '',
    salary: '',
    email: '', // Added email field
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!/^\d+$/.test(employeeData.salary)) {
      errors.salary = 'Salary must be a number';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    addEmployee(employeeData);
    setEmployeeData({
      firstName: '',
      lastName: '',
      nationalId: '',
      dateOfBirth: '',
      position: '',
      employmentDate: '',
      salary: '',
      email: '', // Reset email field
      username: '',
      password: '',
    });
    setFormErrors({});
    setShowForm(false);
  };

  const handleRemove = (id) => {
    removeEmployee(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
        <h2 className="text-lg font-bold text-gray-700">Manager Dashboard</h2>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li className="p-2 bg-gray-200 rounded">Employees</li>
            <li className="p-2 hover:bg-gray-100 rounded">Reports</li>
            <li className="p-2 hover:bg-gray-100 rounded">Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            Add Employee
          </button>
          <input
            type="text"
            placeholder="Search employees..."
            className="p-2 border rounded w-64"
          />
        </header>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            {Object.keys(formErrors).length > 0 && (
              <div className="text-red-500 mb-4">
                {Object.values(formErrors).map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={employeeData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={employeeData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="National ID"
                type="text"
                name="nationalId"
                value={employeeData.nationalId}
                onChange={handleChange}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={employeeData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <Input
                label="Position"
                type="text"
                name="position"
                value={employeeData.position}
                onChange={handleChange}
                required
              />
              <Input
                label="Employment Date"
                type="date"
                name="employmentDate"
                value={employeeData.employmentDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Salary"
                type="number"
                name="salary"
                value={employeeData.salary}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Username"
                type="text"
                name="username"
                value={employeeData.username}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={employeeData.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
              >
                Save Employee
              </button>
            </form>
          </div>
        )}

        {/* Employee Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Position</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!employees || employees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{`${employee.firstName} ${employee.lastName}`}</td>
                    <td className="p-3">{employee.position}</td>
                    <td className="p-3">{employee.email || 'N/A'}</td>
                    <td className="p-3">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        View
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
                        onClick={() => handleRemove(employee.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
