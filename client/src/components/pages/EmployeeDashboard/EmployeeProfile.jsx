import { useState } from "react";
import Footer from "../../Layouts/Footer";
import Header from "../../Layouts/Header";
import ContactDetails from "./ContactDetails";
import PersonalDetails from "./PersonalDetails";
import Qualifications from "./Qualifications";
import ReportTo from "./ReportTo";
// import EmergencyContacts from "./EmergencyContacts";

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState("Contact Details"); // State to track active tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Log activeTab state to verify it's updating correctly
  console.log("Active Tab:", activeTab);

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow-md p-4">
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/100"
              alt="User"
              className="rounded-full mx-auto"
            />
            <h2 className="text-lg font-semibold mt-2">Rambhupal user</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Personal Details",
              "Contact Details",
              "Emergency Contacts",
              "Dependents",
              "Immigration",
              "Job",
              "Salary",
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
        <div className="flex-1 bg-gray-50 p-6 rounded-md shadow-md">
          {activeTab === "Contact Details" && <ContactDetails />}
          {activeTab === "Personal Details" && <PersonalDetails />} {/* This should render PersonalDetails */}
           {activeTab === "Qualifications" && <Qualifications />} 
          {activeTab === "ReportTo" && <ReportTo />} 
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;
