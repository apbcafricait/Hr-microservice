import { useState, useEffect } from "react";

const ContactDetails = () => {
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Contact Details");

  // Fetch data when the component mounts
  useEffect(() => {
    // Fetch contact details from the backend API
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("/api/employee/contactDetails/3"); // Assuming employeeId is 3
        const data = await response.json();
        setContact(data);
      } catch (err) {
        console.error("Error fetching contact details:", err);
      }
    };

    fetchContactDetails();
  }, []);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 flex justify-center items-center">
        {activeTab === "Contact Details" && (
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h2>

            {/* Emergency Contact Section */}
            <div className="mb-4">
              <div>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={contact.emergencyContactName || ""}
                  onChange={handleChange}
                  placeholder="Emergency Contact Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="emergencyContactPhone"
                  value={contact.emergencyContactPhone || ""}
                  onChange={handleChange}
                  placeholder="Emergency Contact Phone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Phone Numbers Section */}
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Phone Number</h3>
            <div className="mb-4">
              <input
                type="text"
                name="phone"
                value={contact.phone || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={!isEditing}
              />
            </div>

            {/* Email Section */}
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Email</h3>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={contact.email || ""}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={!isEditing}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={toggleEdit}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetails;
