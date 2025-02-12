import { useState } from "react";
import ContactDetails from "./ContactDetails";
import PersonalDetails from "./PersonalDetails";
import Qualifications from "./Qualifications";
import ReportTo from "./ReportTo";





const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState("Contact Details"); // State to track active tab
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  
  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // Log activeTab state to verify it's updating correctly
  console.log("Active Tab:", activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`w-64 bg-white shadow-md p-4 transition-all duration-300 ${
            "block"
          }`}
        >
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/100"
              alt="User"
              className="rounded-full mx-auto"
            />
            <h2 className="text-lg font-semibold mt-2">Vincensher</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Personal Details",
              "Contact Details",
              "Dependents",
              "Report-to",
              "Qualifications",
              "Memberships",
            ].map((item) => (
              <li
                key={item}
                className={`p-2 rounded-md cursor-pointer ${
                  activeTab === item ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Conditional Rendering for Active Tab */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === "Contact Details" && <ContactDetails />}
            {activeTab === "Personal Details" && <PersonalDetails />}
            {activeTab === "Qualifications" && <Qualifications />}
            {activeTab === "Report-to" && <ReportTo />}
            {/* Add more components for other tabs if needed */}
          </div>

          {/* Space for Form at the Bottom */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Form Section</h2>
            <p className="text-gray-600">
              This space can be used for additional forms or content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;