import React from 'react';
import { FaSearch, FaUserCog, FaUsers, FaCalendarAlt, FaClock, FaUserPlus, FaUser, FaStar, FaHome, FaBook, FaWrench, FaHandshake } from 'react-icons/fa';
import LeaveDashboard from '../pages/AdminDashboard/LeaveDashboard';
const Sidebar = () => {
  return (
    <div className="sidebar bg-white w-64 h-screen shadow-lg">
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">Nexus</h1>
      </div>
      <nav className="mt-5">
        <ul>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaSearch className="mr-2 text-gray-500" />
              Search
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaUserCog className="mr-2 text-gray-500" />
              Admin
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaUsers className="mr-2 text-gray-500" />
              PIM
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaCalendarAlt className="mr-2 text-gray-500" />
              Leave
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaClock className="mr-2 text-gray-500" />
              Time
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaUserPlus className="mr-2 text-gray-500" />
              Recruitment
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaUser className="mr-2 text-gray-500" />
              My Info
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaStar className="mr-2 text-gray-500" />
              Performance
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-r-full">
              <FaHome className="mr-2 text-white" />
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaBook className="mr-2 text-gray-500" />
              Directory
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaWrench className="mr-2 text-gray-500" />
              Maintenance
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <FaHandshake className="mr-2 text-gray-500" />
              Claim
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;