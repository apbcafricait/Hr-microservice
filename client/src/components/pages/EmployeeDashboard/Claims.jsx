import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetMyClaimsQuery,
  useSubmitClaimMutation,
} from "../../../slices/claimsApiSlice";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Claims = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;

  const { data: employee, isLoading: employeeLoading } = useGetEmployeeQuery(id);
  const employeeId = employee?.data?.employee?.id;

  const { data: claimsData, isLoading: claimsLoading, refetch } =
    useGetMyClaimsQuery();
    console.log(claimsData?.data?.claims, "claims")

  const [submitClaim] = useSubmitClaimMutation();

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    currency: "KES", 
    amount: "",
    fromDate: "",
    toDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      toast.error("Employee ID not available");
      return;
    }
    try {
      await submitClaim({
        ...formData,
        amount: Number(formData.amount),
        employeeId,
      }).unwrap();
      toast.success("Claim submitted successfully");
      setFormData({
        eventName: "",
        description: "",
        currency: "KES",
        amount: "",
        fromDate: "",
        toDate: "",
      });
      refetch();
    } catch (error) {
      toast.error("Failed to submit claim: " + (error?.data?.message || error.message));
    }
  };

  const isLoading = employeeLoading || claimsLoading;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg shadow-md">
          Claims
        </h1>
      </header>

      {/* Claim Submission Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Submit New Claim
        </h2>
        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <select
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            >
              <option value="">Select Event</option>
              <option value="Medical Reimbursement">Medical Reimbursement</option>
              <option value="Travel Allowance">Travel Allowance</option>
              <option value="Advanced Salary">Advanced Salary</option>
              <option value="Over-Time">Over-Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Describe your claim"
              rows="3"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="0.00"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 shadow-md"
            disabled={isLoading || !employeeId}
          >
            Submit Claim
          </button>
        </form>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Claims</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading claims...</p>
        ) : claimsData?.data?.claims.length === 0 ? (
          <p className="text-gray-600">No claims found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Reference ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Event Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {claimsData?.data?.claims.map((claim) => (
                  <tr
                    key={claim.referenceId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.referenceId}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.eventName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.amount?.toLocaleString("en-US", {
                        style: "currency",
                        currency: claim.currency || formData.currency, // Use claim currency if available
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : claim.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : claim.status === "SUBMITTED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;