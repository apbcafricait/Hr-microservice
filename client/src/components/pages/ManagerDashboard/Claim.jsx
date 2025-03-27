import React from "react";
import { useSelector } from "react-redux";
import { useGetAllClaimsQuery, useUpdateClaimStatusMutation } from "../../../slices/claimsApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const Claim = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isManager = userInfo?.role === "manager"; // Assuming role is set in auth state

  // API hooks
  const { data: claimsData, isLoading, error, refetch } = useGetAllClaimsQuery({
    organisationId: userInfo?.organisationId, // Pass organisationId from userInfo
  });
  const [updateClaimStatus] = useUpdateClaimStatusMutation();

  // Handle claim status update
  const handleStatusUpdate = async (claimId, status) => {
    try {
      await updateClaimStatus({ claimId, status }).unwrap();
      toast.success(`Claim ${status.toLowerCase()} successfully`);
      refetch(); // Refresh the claim list
    } catch (error) {
      toast.error(`Failed to update claim status: ${error?.data?.message || error.message}`);
    }
  };

  // Prepare data for CSV download
  const csvData = claimsData?.data?.claims.map((claim) => ({
    ReferenceID: claim.referenceId,
    EmployeeName: `${claim.employee?.firstName} ${claim.employee?.lastName}`,
    EventName: claim.eventName,
    Amount: claim.amount.toLocaleString("en-US", { style: "currency", currency: claim.currency || "USD" }),
    Status: claim.status,
    SubmittedDate: new Date(claim.submittedDate).toLocaleDateString(),
  })) || [];

  if (!isManager) {
    return <p className="text-center text-red-500">Unauthorized Access</p>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg shadow-md">
          Manage Claims
        </h1>
        {claimsData?.data?.claims.length > 0 && (
          <CSVLink
            data={csvData}
            filename={`claims_${new Date().toISOString().split("T")[0]}.csv`}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Download Claims
          </CSVLink>
        )}
      </header>

      {/* Claims Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Claims</h2>
        {isLoading ? (
          <p className="text-gray-600">Loading claims...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : claimsData?.data?.claims.length === 0 ? (
          <p className="text-gray-600">No claims found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Reference ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Event Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimsData?.data?.claims.map((claim) => (
                  <tr key={claim.referenceId} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.referenceId}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.employee?.firstName} {claim.employee?.lastName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.eventName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: claim.currency || "USD",
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
                    <td className="px-4 py-2 text-sm flex gap-2">
                      {claim.status !== "APPROVED" && claim.status !== "REJECTED" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, "APPROVED")}
                            className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, "REJECTED")}
                            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
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