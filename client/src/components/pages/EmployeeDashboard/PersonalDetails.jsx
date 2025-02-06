import React, { useState } from 'react';

function PersonalDetails() {
  const [employee, setEmployee] = useState({
    fullName: '',
    middleName: '',
    officeId: '',
    date: '',
    licenseNumber: '',
    licenseExpiry: '',
    nationality: '',
    maritalStatus: '',
    dob: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
      <form>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
          <input type="text" name="officeId" placeholder="Office ID" onChange={handleChange} />
          <input type="date" name="date" onChange={handleChange} />
          <input type="text" name="licenseNumber" placeholder="Driver's License Number" onChange={handleChange} />
          <input type="date" name="licenseExpiry" placeholder="License Expiry Date" onChange={handleChange} />
          <input type="text" name="nationality" placeholder="Nationality" onChange={handleChange} />
          <select name="maritalStatus" onChange={handleChange}>
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          <input type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} />
          <select name="gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;