import { useState } from 'react';
import { 
  HomeIcon, 
  ClockIcon, 
  CalendarIcon, 
  UserIcon, 
  DocumentTextIcon,
  PhoneIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import ApplyLeave from './ApplyLeave';
import ContactDetails from './ContactDetails';
import EmployeeProfile from './EmployeeProfile';
import LeaveApproval from './LeaveApproval';
import PersonalDetails from './PersonalDetails';
import Qualifications from './Qualifications';
import ReportTo from './ReportTo';
import TimeAtWork from './TimeAtWork';

const EmployeeDashboard = () => {
  const [activeSubComponent, setActiveSubComponent] = useState('Dashboard');

  const subMenuItems = [
    { name: 'Dashboard', icon: HomeIcon, component: 'Dashboard' },
    { name: 'Apply Leave', icon: CalendarIcon, component: 'ApplyLeave' },
    { name: 'Contact Details', icon: PhoneIcon, component: 'ContactDetails' },
    { name: 'Employee Profile', icon: UserIcon, component: 'EmployeeProfile' },
    { name: 'Leave Approval', icon: ShieldCheckIcon, component: 'LeaveApproval' },
    { name: 'Personal Details', icon: DocumentTextIcon, component: 'PersonalDetails' },
    { name: 'Qualifications', icon: AcademicCapIcon, component: 'Qualifications' },
    { name: 'Report To', icon: UserGroupIcon, component: 'ReportTo' },
    { name: 'Time at Work', icon: ClockIcon, component: 'TimeAtWork' },
  ];

  const renderSubComponent = () => {
    switch (activeSubComponent) {
      case 'Dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Today's Attendance</h3>
                <p>Check-in: 9:00 AM</p>
                <p>Check-out: --</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Leave Balance</h3>
                <p>Annual: 15 days</p>
                <p>Sick: 7 days</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Pending Tasks</h3>
                <p>3 tasks due this week</p>
              </div>
            </div>
          </div>
        );
      case 'ApplyLeave':
        return <ApplyLeave />;
      case 'ContactDetails':
        return <ContactDetails />;
      case 'EmployeeProfile':
        return <EmployeeProfile />;
      case 'LeaveApproval':
        return <LeaveApproval />;
      case 'PersonalDetails':
        return <PersonalDetails />;
      case 'Qualifications':
        return <Qualifications />;
      case 'ReportTo':
        return <ReportTo />;
      case 'TimeAtWork':
        return <TimeAtWork />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Today's Attendance</h3>
                <p>Check-in: 9:00 AM</p>
                <p>Check-out: --</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Leave Balance</h3>
                <p>Annual: 15 days</p>
                <p>Sick: 7 days</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Pending Tasks</h3>
                <p>3 tasks due this week</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      {/* Internal Sidebar */}
      <div className="w-64 h-screen bg-gray-100 text-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Dashboard Menu</h2>
          <nav>
            <ul>
              {subMenuItems.map((item) => (
                <li key={item.name} className="mb-2">
                  <button
                    onClick={() => setActiveSubComponent(item.component)}
                    className="flex items-center w-full p-3 rounded hover:bg-gray-200"
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1">{renderSubComponent()}</div>
    </div>
  );
};

export default EmployeeDashboard;