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
  CogIcon,
  LogoutIcon // Import the logout icon
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux'; // If using Redux
import { logout } from '../../slices/authSlice'; // Adjust the import according to your auth slice
import { useNavigate } from 'react-router-dom'; // Import navigate hook

const EmployeeSidebar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState('EmployeeDashboard');
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, component: 'EmployeeDashboard' },
    { name: 'Apply Leave', icon: CalendarIcon, component: 'ApplyLeave' },
    { name: 'Leave Approval', icon: ShieldCheckIcon, component: 'LeaveApproval' },
    { name: 'Qualifications', icon: AcademicCapIcon, component: 'Qualifications' },
    { name: 'Time at Work', icon: ClockIcon, component: 'TimeAtWork' },
  ];

  const dispatch = useDispatch(); // Create dispatch function
  const navigate = useNavigate(); // Create navigate function

  const handleItemClick = (component) => {
    setActiveItem(component);
    setActiveComponent(component);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate('/login'); // Redirect to login page
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
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-700"
        >
          <LogoutIcon className="w-6 h-6 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;