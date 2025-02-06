import React, { useState } from 'react';
import Footer from '../../Layouts/Footer';
import Header from '../../Layouts/Header';
import Sidebar from '../../Layouts/Sidebar';
import ContactDetails from './ContactDetails';
import PersonalDetails from './PersonalDetails';
//import EmergencyContacts from './EmergencyContacts';

const EmployeeProfile = () => {
    const [activeTab, setActiveTab] = useState("contact-details"); // State to track active tab
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="h-screen flex flex-col">
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 flex">
                {/* Sidebar */}
                <div className={`w-1/4 bg-white p-4 rounded-md shadow-md transition-width duration-300 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                    <ul className="space-y-4 text-gray-700">
                        <li onClick={() => handleTabClick("contact-details")} className={activeTab === "contact-details" ? "font-bold text-blue-600 cursor-pointer" : "cursor-pointer"}>
                            Contact Details
                        </li>
                        <li onClick={() => handleTabClick("personal-details")} className={activeTab === "personal-details" ? "font-bold text-blue-600 cursor-pointer" : "cursor-pointer"}>
                            Personal Details
                        </li>
                        <li onClick={() => handleTabClick("emergency-contacts")} className={activeTab === "emergency-contacts" ? "font-bold text-blue-600 cursor-pointer" : "cursor-pointer"}>
                            Emergency Contacts
                        </li>*/
                    </ul>
                </div>

                {/* Main Content */}
                <div className={`flex-1 bg-gray-50 p-6 rounded-md shadow-md transition-width duration-300 ${isSidebarOpen ? '' : 'md:ml-4'}`}>
                    {activeTab === "contact-details" && <ContactDetails />}
                    {activeTab === "personal-details" && <PersonalDetails />}
                    {activeTab === "emergency-contacts" && <EmergencyContacts />}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmployeeProfile;