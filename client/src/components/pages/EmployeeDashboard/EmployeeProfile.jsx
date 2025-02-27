import { useState } from "react";
import ContactDetails from "./ContactDetails";
import PersonalDetails from "./PersonalDetails";
import Qualifications from "./Qualifications";
import ReportTo from "./ReportTo";
import Dependents from "./Dependents";
import { FaUser, FaPhone, FaUsers, FaRegListAlt, FaGraduationCap } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState("Contact Details"); // State to track active tab
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo)
  const id = userInfo?.id;
  const { data: employee, isLoading, error } = useGetEmployeeQuery(id);

  const UserNames = employee?.data.employee.firstName + " " + employee?.data.employee.lastName;
  const tabs = [
    { name: "Personal Details", icon: <FaUser /> },
    { name: "Contact Details", icon: <FaPhone /> },
    { name: "Dependents", icon: <FaUsers /> },
    { name: "Report-to", icon: <FaRegListAlt /> },
    { name: "Qualifications", icon: <FaGraduationCap /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ml-12">
      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`w-64 bg-white shadow-md p-4 transition-all duration-300`}>
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/100"
              alt="User"
              className="rounded-full mx-auto"
            />
            <h2 className="text-lg font-semibold mt-2">{UserNames}</h2>
          </div>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  activeTab === tab.name ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                <span className="mr-2 text-gray-600">{tab.icon}</span>
                {tab.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Conditional Rendering for Active Tab */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === "Personal Details" && <PersonalDetails />}
            {activeTab === "Contact Details" && <ContactDetails />}
            {activeTab === "Dependents" && <Dependents />}
            {activeTab === "Qualifications" && <Qualifications />}
            {activeTab === "Report-to" && <ReportTo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
