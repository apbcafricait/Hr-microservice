
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ClockArrowUp, ClockArrowDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useClockInMutation } from '../../../slices/attendanceSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const user = {
  name: 'Victor Nyandoro',
  email: 'nyandorovictor3900@gmail.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const navigation = [
  { name: 'Dashboard', href: '#dashboard', current: true },
  { name: 'Time at work', href: '#time-at-work', current: false },
  { name: 'My Projects', href: '#my-projects', current: false },
  { name: 'Apply leave', href: '#apply-leave', current: false },
  { name: 'Reports', href: '#reports', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Notification({ notifications }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold">Notifications</h2>
      <ul className="mt-2">
        {notifications.length === 0 ? (
          <li className="text-gray-600">No notifications</li>
        ) : (
          notifications.map((notification, index) => (
            <li key={index} className="text-gray-600">{notification}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function Example() {
  const [projects, setProjects] = useState('');
  const [location, setLocation] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [Clockin] = useClockInMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.id;

  const formData = {
    employeeId,
    location
  };

  useEffect(() => {
    setNotifications((prev) => [...prev, "You have logged in successfully."]);
  }, []);

  const handleClockIn = async () => {
    try {
      const res = await Clockin(formData).unwrap();
      setNotifications((prev) => [...prev, "You have clocked in successfully."]);
      toast.success("Successfully clocked in!"); // Toast notification
    } catch (error) {
      toast.error("Failed to clock in."); // Error toast
    }
  };

  const handleClockOut = async () => {
    try {
      // Assumed similar mutation for clock out
      const res = await Clockin(formData).unwrap(); // Replace with actual clock out mutation
      setNotifications((prev) => [...prev, "You have clocked out successfully."]);
      toast.success("Successfully clocked out!"); // Toast notification
    } catch (error) {
      toast.error("Failed to clock out."); // Error toast
    }
  };

  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <aside className="bg-gray-800 w-64">
        <div className="flex items-center h-16 px-4">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            className="size-8"
          />
        </div>
        <nav className="mt-4">
          <div className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Cards Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1: Time at Work */}
              <Disclosure>
                {({ open }) => (
                  <motion.div
                    className={`bg-white shadow-md rounded-lg transition-transform duration-300 ${open ? 'p-6' : 'p-4'} hover:scale-105`}
                    whileHover={{ scale: 1.05 }}
                    id="time-at-work"
                  >
                    <DisclosureButton className="flex items-center justify-between w-full">
                      <h2 className="text-lg font-semibold">Time at Work</h2>
                      <input 
                        type="text" 
                        placeholder="Location" 
                        onChange={(e) => setLocation(e.target.value)}
                        className="border rounded-md p-1"
                      />
                      <div className="flex space-x-2">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600" title="Clock In" onClick={handleClockIn}>
                          <ClockArrowUp className="h-5 w-5" />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600" title="Clock Out" onClick={handleClockOut}>
                          <ClockArrowDown className="h-5 w-5" />
                        </button>
                      </div>
                    </DisclosureButton>
                    <DisclosurePanel className="mt-4">
                      <p className="text-gray-600">Track your clock in and clock out times here.</p>
                    </DisclosurePanel>
                  </motion.div>
                )}
              </Disclosure>

              {/* Add other cards here */}
              <Notification notifications={notifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}