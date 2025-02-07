import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockArrowUp, ClockArrowDown } from 'lucide-react';

export default function Example() {
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [duration, setDuration] = useState(null);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockOutTime(null); // Reset clock out time when clocking in
    setDuration(null); // Reset duration
    console.log(`Clocked in at: ${now.toLocaleString()}`);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    if (clockInTime) {
      const diff = now - clockInTime; // Calculate duration in milliseconds
      const hours = Math.floor((diff % 86400000) / 3600000); // Convert to hours
      const minutes = Math.round(((diff % 86400000) % 3600000) / 60000); // Convert to minutes
      setDuration(`${hours}h ${minutes}m`);
      console.log(`Clocked out at: ${now.toLocaleString()}`);
    } else {
      alert("You need to clock in first!");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ...Other Cards... */}

          {/* Card: Time at Work */}
          <motion.div
            className="bg-white shadow-md rounded-lg p-4 transition-transform duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Time at Work</h2>
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600"
                  title="Clock In"
                  onClick={handleClockIn}
                >
                  <ClockArrowUp className="h-5 w-5" />
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600"
                  title="Clock Out"
                  onClick={handleClockOut}
                >
                  <ClockArrowDown className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              {clockInTime && (
                <p>
                  Clocked In: {clockInTime.toLocaleString()}
                </p>
              )}
              {clockOutTime && (
                <p>
                  Clocked Out: {clockOutTime.toLocaleString()}
                </p>
              )}
              {duration && (
                <p>
                  Duration: {duration}
                </p>
              )}
            </div>
          </motion.div>

          {/* Other cards can be added here */}
        </div>
      </div>
    </>
  );
}