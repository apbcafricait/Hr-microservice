import React from 'react';

const Security = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Update Password</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Security;