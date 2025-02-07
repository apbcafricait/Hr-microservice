import React, { useState } from "react";

const ContactDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    homePhone: "",
    mobilePhone: "",
    workPhone: "",
    workEmail: "",
    otherEmail: "",
  });

  const [attachments, setAttachments] = useState([]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved Contact Details:", contact);
    setIsEditing(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-6 min-h-screen mt-20">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-md shadow-md">
        <div className="text-center mb-6">
          <div className="h-24 w-24 mx-auto bg-gray-300 rounded-full" />
          <p className="mt-4 font-semibold text-gray-700">Abi Habeeb</p>
        </div>
        <ul className="space-y-4 text-gray-600">
          <li>Personal Details</li>
          <li className="font-bold text-blue-600">Contact Details</li>
          <li>Emergency Contacts</li>
          <li>Dependents</li>
          <li>Job</li>
          <li>Salary</li>
          <li>Qualifications</li>
          <li>Memberships</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-md shadow-md ml-0 md:ml-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Details</h2>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "Street 1", name: "street1" },
            { label: "Street 2", name: "street2" },
            { label: "City", name: "city" },
            { label: "State/Province", name: "state" },
            { label: "Zip/Postal Code", name: "zip" },
          ].map(({ label, name }) => (
            <div key={name}>
              <input
                type="text"
                name={name}
                value={contact[name]}
                onChange={handleChange}
                placeholder={label}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isEditing ? "bg-white border-blue-400 focus:ring-blue-400" : "bg-gray-100 border-gray-300"
                }`}
                disabled={!isEditing}
              />
            </div>
          ))}

          {/* Country Dropdown */}
          <div>
            <select
              name="country"
              value={contact.country}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "bg-white border-blue-400 focus:ring-blue-400" : "bg-gray-100 border-gray-300"
              }`}
              disabled={!isEditing}
            >
              <option value="">-- Select Country --</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="Kenya">Kenya</option>
            </select>
          </div>
        </div>

        {/* Telephone Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Home Phone", name: "homePhone" },
            { label: "Mobile Phone", name: "mobilePhone" },
            { label: "Work Phone", name: "workPhone" },
          ].map(({ label, name }) => (
            <div key={name}>
              <input
                type="text"
                name={name}
                value={contact[name]}
                onChange={handleChange}
                placeholder={label}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isEditing ? "bg-white border-blue-400 focus:ring-blue-400" : "bg-gray-100 border-gray-300"
                }`}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Email Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "Work Email", name: "workEmail" },
            { label: "Other Email", name: "otherEmail" },
          ].map(({ label, name }) => (
            <div key={name}>
              <input
                type="email"
                name={name}
                value={contact[name]}
                onChange={handleChange}
                placeholder={label}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isEditing ? "bg-white border-blue-400 focus:ring-blue-400" : "bg-gray-100 border-gray-300"
                }`}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isEditing ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* Attachments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Attachments</h3>
          
          {/* File Upload Input (Hidden) */}
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          
          {/* Display Attachments */}
          <div className="border border-gray-300 rounded-md p-4">
            {attachments.length === 0 ? (
              <p className="text-center text-gray-500">No Records Found</p>
            ) : (
              <ul className="list-disc pl-5">
                {attachments.map((file, index) => (
                  <li key={index} className="text-gray-700">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Button */}
          <label
            htmlFor="file-upload"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer inline-block"
          >
            + Add
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
