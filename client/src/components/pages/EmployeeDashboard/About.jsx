import React from "react";
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Our Organization
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are committed to empowering our employees with the best tools and resources 
            to achieve their professional goals and contribute to our company's success.
          </p>
        </div>

        {/* Company Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Company Overview</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Our organization is built on the foundation of innovation, collaboration, and excellence. 
            We believe in creating an environment where every employee can thrive and grow both 
            personally and professionally. With a focus on continuous improvement and employee 
            development, we strive to be the employer of choice in our industry.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <HeartIcon className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-700">
              To provide exceptional value to our customers while fostering a workplace 
              culture that promotes innovation, integrity, and mutual respect.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Our Values</h3>
            </div>
            <ul className="text-gray-700 space-y-2">
              <li>• Integrity and transparency in all dealings</li>
              <li>• Excellence in everything we do</li>
              <li>• Respect for diversity and inclusion</li>
              <li>• Innovation and continuous improvement</li>
            </ul>
          </div>
        </div>

        {/* Employee Portal Info */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center mb-6">
            <GlobeAltIcon className="w-8 h-8 text-white mr-3" />
            <h2 className="text-2xl font-semibold">Employee Portal</h2>
          </div>
          <p className="text-blue-100 leading-relaxed mb-6">
            This portal is designed to streamline your work experience and provide easy access 
            to all the tools and information you need. From managing your profile and leave 
            requests to tracking your performance and submitting suggestions, everything is 
            just a click away.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Profile Management</h4>
              <p className="text-blue-100">Update your personal and contact information</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Leave Management</h4>
              <p className="text-blue-100">Apply for and track your leave requests</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Performance Tracking</h4>
              <p className="text-blue-100">Monitor your work progress and achievements</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">HR Department</h3>
              <p className="text-gray-600">For general inquiries and support</p>
              <p className="text-blue-600">hrneuxes.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">IT Support</h3>
              <p className="text-gray-600">For technical issues with the portal</p>
              <p className="text-blue-600">apbcafricait@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 