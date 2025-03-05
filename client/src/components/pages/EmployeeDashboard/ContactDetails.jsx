import  { useState } from "react";
import { useCreateEmployeeContactMutation } from "../../../slices/ContactSlice";
import { useSelector } from "react-redux";

const ContactDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  console.log(id, 'id')

  const [contact, setContact] = useState({
    employeeId: id,
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Contact Details");

  // Use the createEmployeeContact mutation from the API slice
  const [createEmployeeContact, { isLoading }] = useCreateEmployeeContactMutation();

  // Handle input changes
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Toggle edit mode
  const toggleEdit = () => setIsEditing(!isEditing);

  // Handle form submission for creating a new contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.employeeId) {
      alert("Employee ID is required!");
      return;
    }

    try {
     const res= await createEmployeeContact(contact).unwrap(); // Trigger the mutation
     console.log(res);
      alert("Contact created successfully!");
      setContact({
        employeeId: "",
        phone: "",
        email: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      }); // Reset the form
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error creating contact:", err);
      alert("Failed to create contact. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 flex justify-center items-center">
        {activeTab === "Contact Details" && (
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h2>
            {/* Form for creating or editing contact details */}
            <form onSubmit={handleSubmit}>
              {/* Employee ID Section */}
              <div className="mb-4">
                <input
                  type="text"
                  name="employeeId"
                  value={contact.employeeId}
                  onChange={handleChange}
                  placeholder="Employee ID"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                  required
                />
              </div>

              {/* Emergency Contact Section */}
              <div className="mb-4">
                <input
                  type="text"
                  name="emergencyContactName"
                  value={contact.emergencyContactName}
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
                  value={contact.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Emergency Contact Phone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                />
              </div>

              {/* Phone Numbers Section */}
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Phone Number</h3>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  value={contact.phone}
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
                  value={contact.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Save"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={toggleEdit}
                  >
                    Add New Contact
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetails;
