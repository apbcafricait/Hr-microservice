import React, { useState } from "react";
import { useChangePasswordMutation } from "../../../slices/changePasswordSlice";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Use the mutation hook
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handlePasswordChange = async () => {
    setError("");
    setSuccessMessage("");

    // Validate input
    if (newPassword.length < 6 || newPassword.length > 15) {
      setError("Password must be between 6 and 15 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    try {
      // Call the mutation
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      setSuccessMessage(response.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Handle error from the mutation
      setError(err.data?.message || "An error occurred while changing the password.");
    }
  };

  return (
    <div className="p-6 w-full h-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

        {/* Display Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Display Success Message */}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4 text-center">
            {successMessage}
          </p>
        )}

        <form>
          {/* Current Password */}
          <div className="mb-4">
            <label
              htmlFor="current-password"
              className="block text-lg font-medium mb-1"
            >
              Current Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="current-password"
              className="w-full px-4 py-2 border rounded-lg text-base"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-lg font-medium mb-1"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="new-password"
              className="w-full px-4 py-2 border rounded-lg text-base"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-lg font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              className="w-full px-4 py-2 border rounded-lg text-base"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {/* Show Password Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="show-password"
              className="mr-2"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="show-password" className="text-base">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className={`w-full py-2 px-4 rounded-lg text-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={handlePasswordChange}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
