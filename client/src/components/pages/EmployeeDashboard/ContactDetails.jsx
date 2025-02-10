import { useState, useEffect } from "react";

const ContactDetails = () => {
  const [contact, setContact] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    home: "",
    mobile: "",
    work: "",
    email: "",
    otherEmail: ""
  });
  const [countries, setCountries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Contact Details");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => setCountries(data.map((c) => c.name.common).sort()))
      .catch((err) => console.error("Error fetching countries:", err));
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

            {/* Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[{ label: "Street 1", name: "street1" }, { label: "Street 2", name: "street2" }, { label: "City", name: "city" }, { label: "State/Province", name: "state" }, { label: "Zip/Postal Code", name: "zip" }].map(({ label, name }) => (
                <div key={name}>
                  <input
                    type="text"
                    name={name}
                    value={contact[name]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!isEditing}
                  />
                </div>
              ))}
              <div>
                <select
                  name="country"
                  value={contact.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!isEditing}
                >
                  <option value="">-- Select Country --</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Numbers Section */}
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Phone Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[{ label: "Home", name: "home" }, { label: "Mobile", name: "mobile" }, { label: "Work", name: "work" }].map(({ label, name }) => (
                <div key={name}>
                  <input
                    type="text"
                    name={name}
                    value={contact[name]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>

            {/* Email Section */}
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Emails</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[{ label: "Email (Required)", name: "email" }, { label: "Other Email (Optional)", name: "otherEmail" }].map(({ label, name }) => (
                <div key={name}>
                  <input
                    type="email"
                    name={name}
                    value={contact[name]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!isEditing}
                    required={name === "email"}
                  />
                </div>
              ))}
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
