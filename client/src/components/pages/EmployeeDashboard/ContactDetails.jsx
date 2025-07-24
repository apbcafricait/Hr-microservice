import { useState } from "react";
import { useCreateEmployeeContactMutation } from "../../../slices/ContactSlice";
import { useSelector } from "react-redux";
import {  useGetEmployeeQuery } from "../../../slices/employeeSlice";

const ContactDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  console.log(id, "id");
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const employeeId = orgEmpData?.data.employee.id;

  const [contact, setContact] = useState({
    employeeId: employeeId,
    phone: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Contact Details");

  const [createEmployeeContact, { isLoading }] = useCreateEmployeeContactMutation();

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate employeeId
    if (!contact.employeeId || isNaN(contact.employeeId)) {
        alert("Valid Employee ID is required!");
        return;
    }

    // Validate required fields (phone and email, if applicable)
    if (!contact.email.trim()) {
        alert("Email is required!");
        return;
    }

    // Convert employeeId to integer
    const employeeId = parseInt(contact.employeeId, 10);

    try {
        // Send data to the backend
        const res = await createEmployeeContact({
            ...contact,
            employeeId, // Ensures employeeId is sent as an integer
        }).unwrap();

        console.log("API Response:", res);
        alert("Contact created successfully!");

        // Reset form state
        setContact({
            employeeId: id || "", // Default to current user's ID
            phone: "",
            email: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
        });
        setIsEditing(false); // Exit edit mode
    } catch (err) {
        console.error("Error creating contact:", err);

        // Handle specific API error responses if available
        if (err?.data?.message) {
            alert(`Error: ${err.data.message}`);
        } else {
            alert("Failed to create contact. Please try again.");
        }
    }
};


  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-100 p-6 flex justify-center items-center">
        {activeTab === "Contact Details" && (
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="number"
                  name="employeeId"
                  value={contact.employeeId}
                  onChange={handleChange}
                  placeholder="Employee ID"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                  required
                />
              </div>

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
