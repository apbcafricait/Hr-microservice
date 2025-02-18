import { useState, useEffect } from "react";
const ContactDetails = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Email:</strong> john.doe@company.com</p>
        <p><strong>Phone:</strong> +1 234 567 890</p>
        <p><strong>Emergency Contact:</strong> Jane Doe (+1 234 567 891)</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Edit Contact Details
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;
