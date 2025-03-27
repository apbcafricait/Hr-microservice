import React, { useState, useEffect } from "react";
import {
  useGetMyClaimsQuery,
  useSubmitClaimMutation, // Only these two hooks are needed for employees
} from "../../../slices/claimsApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Claim = () => {
  const { data: claimsData, isLoading, error, refetch } = useGetMyClaimsQuery();
  const [submitClaim] = useSubmitClaimMutation(); // Correct hook for submitting claims

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    currency: "KES",
    amount: "",
    fromDate: "",
    toDate: "",
    comment: "",
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch claims: " + error.message);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const claimData = {
        ...formData,
        amount: parseFloat(formData.amount), // Convert to float for backend
      };
      await submitClaim(claimData).unwrap();
      toast.success("Claim submitted successfully!");
      setFormData({
        eventName: "",
        description: "",
        currency: "KES",
        amount: "",
        fromDate: "",
        toDate: "",
        comment: "",
      });
      refetch(); // Refresh claims list
    } catch (err) {
      toast.error("Failed to submit claim: " + (err?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg shadow-md">
          My Claims
        </h1>
      </header>

      {/* Claim Submission Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit a New Claim</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Event Name"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
            required
          />
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
            required
            step="0.01"
          />
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment (optional)"
            className="border p-2 rounded col-span-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-full"
          >
            Submit Claim
          </button>
        </form>
      </div>

      {/* Claims Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Claims</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading claims...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : claimsData?.data?.claims.length === 0 ? (
          <p className="text-gray-600">No claims submitted yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Reference ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Event Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {claimsData?.data?.claims.map((claim) => (
                  <tr key={claim.referenceId} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.referenceId}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.eventName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: claim.currency || "KES",
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : claim.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : claim.status === "IN_REVIEW" || claim.status === "ASSIGNED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800" // For "CLAIM_SUBMITTED"
                        }`}
                      >
                        {claim.status === "CLAIM_SUBMITTED"
                          ? "Claim Submitted"
                          : claim.status === "IN_REVIEW"
                          ? "In Review"
                          : claim.status === "ASSIGNED"
                          ? "Assigned"
                          : claim.status}
                      </span>
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

export default Claim;