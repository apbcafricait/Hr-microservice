import React, { useState } from 'react';
import { FaSearch, FaUserCog, FaUsers, FaCalendarAlt, FaClock, FaUserPlus, FaUser, FaStar, FaHome, FaBook, FaWrench, FaHandshake } from 'react-icons/fa';
import LeaveDashboard from '../pages/AdminDashboard/LeaveDashboard';

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('LeaveDashboard'); // Initialize with 'Dashboard'
  const [showLeaveDashboard, setShowLeaveDashboard] = useState(false);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    if (linkName === 'Leave') {
      setShowLeaveDashboard(true);
    } else {
      setShowLeaveDashboard(false);
    }
  };

  return (
    <div className="sidebar bg-white w-64 h-screen shadow-lg flex"> {/* Use flex to control the layout */}
      <div className="w-64"> {/* Sidebar content */}
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-green-600">Nexus</h1>
        </div>
        <nav className="mt-5">
          <ul>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Search' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  handleLinkClick('Search');
                }}
              >
                <FaSearch className={`mr-2 ${activeLink === 'Search' ? 'text-white' : 'text-gray-500'}`} />
                Search
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Admin' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Admin');
                }}
              >
                <FaUserCog className={`mr-2 ${activeLink === 'Admin' ? 'text-white' : 'text-gray-500'}`} />
                Admin
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'PIM' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('PIM');
                }}
              >
                <FaUsers className={`mr-2 ${activeLink === 'PIM' ? 'text-white' : 'text-gray-500'}`} />
                PIM
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Leave' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Leave');
                }}
              >
                <FaCalendarAlt className={`mr-2 ${activeLink === 'Leave' ? 'text-white' : 'text-gray-500'}`} />
                Leave
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Time' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Time');
                }}
              >
                <FaClock className={`mr-2 ${activeLink === 'Time' ? 'text-white' : 'text-gray-500'}`} />
                Time
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Recruitment' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Recruitment');
                }}
              >
                <FaUserPlus className={`mr-2 ${activeLink === 'Recruitment' ? 'text-white' : 'text-gray-500'}`} />
                Recruitment
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'My Info' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('My Info');
                }}
              >
                <FaUser className={`mr-2 ${activeLink === 'My Info' ? 'text-white' : 'text-gray-500'}`} />
                My Info
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Performance' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Performance');
                }}
              >
                <FaStar className={`mr-2 ${activeLink === 'Performance' ? 'text-white' : 'text-gray-500'}`} />
                Performance
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 ${
                  activeLink === 'Dashboard' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Dashboard');
                }}
              >
                <FaHome className={`mr-2 ${activeLink === 'Dashboard' ? 'text-white' : 'text-gray-500'}`} />
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Directory' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Directory');
                }}
              >
                <FaBook className={`mr-2 ${activeLink === 'Directory' ? 'text-white' : 'text-gray-500'}`} />
                Directory
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Maintenance' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Maintenance');
                }}
              >
                <FaWrench className={`mr-2 ${activeLink === 'Maintenance' ? 'text-white' : 'text-gray-500'}`} />
                Maintenance
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                  activeLink === 'Claim' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('Claim');
                }}
              >
                <FaHandshake className={`mr-2 ${activeLink === 'Claim' ? 'text-white' : 'text-gray-500'}`} />
                Claim
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-4"> {/* Main content area */}
        {showLeaveDashboard && <LeaveDashboard />} {/* Render LeaveDashboard based on showLeaveDashboard */}
      </div>
    </div>
  );
};

export default Sidebar;
