import React from "react";

const EmployeeSettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Employee Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">
            ×
          </button>
        </div>
        <div>
          {/* Insert future setting components here like notification settings, theme toggles, etc. */}
          <p className="text-gray-600">Settings content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettingsModal;
