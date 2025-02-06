import React from "react";

const ContactDetails = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-50 p-6">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded-md shadow-md">
        <div className="text-center mb-6">
          <div className="h-24 w-24 mx-auto bg-gray-300 rounded-full" />
          <p className="mt-4 font-semibold">abi habeeb</p>
        </div>
        <ul className="space-y-4 text-gray-700">
          <li>Personal Details</li>
          <li className="font-bold text-blue-600">Contact Details</li>
          <li>Emergency Contacts</li>
          <li>Dependents</li>
          <li>Immigration</li>
          <li>Job</li>
          <li>Salary</li>
          <li>Report-to</li>
          <li>Qualifications</li>
          <li>Memberships</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white p-6 rounded-md shadow-md ml-0 md:ml-6">
        <h2 className="text-lg font-semibold mb-6">Contact Details</h2>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Street 1</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street 2</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State/Province</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zip/Postal Code</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>-- Select --</option>
              <option>USA</option>
              <option>Canada</option>
              <option>Kenya</option>
            </select>
          </div>
        </div>

        {/* Telephone Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Home</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Work</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Email Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Work Email</label>
            <input
              type="email"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Other Email</label>
            <input
              type="email"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
          Save
        </button>

        {/* Attachments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Attachments</h3>
          <div className="border border-gray-300 rounded-md p-4 text-center text-gray-500">
            No Records Found
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
