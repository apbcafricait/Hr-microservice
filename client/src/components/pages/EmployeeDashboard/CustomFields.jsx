import React, { useState } from 'react';

function CustomFields() {
  const [customFields, setCustomFields] = useState({
    bloodType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomFields({ ...customFields, [name]: value });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Custom Fields</h2>
      <form>
        <div>
          <select name="bloodType" onChange={handleChange}>
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </form>
    </div>
  );
}

export default CustomFields;