import { useState } from 'react';
import { 
  HomeIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserIcon, 
  DocumentTextIcon,
  
  ShieldCheckIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon // Import the settings icon
} from '@heroicons/react/24/outline';

const EmployeeSidebar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState('EmployeeDashboard'); // Track active component
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, component: 'EmployeeDashboard' },
    { name: 'Apply Leave', icon: CalendarIcon, component: 'ApplyLeave' },
    { name: 'Leave Approval', icon: ShieldCheckIcon, component: 'LeaveApproval' },
    { name: 'Personal Details', icon: DocumentTextIcon, component: 'PersonalDetails' },
    { name: 'Qualifications', icon: AcademicCapIcon, component: 'Qualifications' },
    { name: 'Report To', icon: UserGroupIcon, component: 'ReportTo' },
    { name: 'Time at Work', icon: ClockIcon, component: 'TimeAtWork' },
  ];

  const handleItemClick = (component) => {
    setActiveItem(component); // Update active item
    setActiveComponent(component); // Trigger parent component change
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed rounded-r-3xl shadow-lg flex flex-col">
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-8">Employee Dashboard</h1>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => handleItemClick(item.component)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out ${activeItem === item.component ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  {/* Blue dot indicator */}
                  <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${activeItem === item.component ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <item.icon className="w-6 h-6 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* User Profile and Settings Icons */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <UserIcon className="w-6 h-6 text-white" />
          <span className="ml-2">User Profile</span>
        </div>
        <button className="flex items-center mt-2 p-2 rounded-lg hover:bg-gray-700">
          <CogIcon className="w-6 h-6 text-white" />
          <span className="ml-2">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;