import React from "react";
import { useSelector } from "react-redux";
import { useGetClaimsByOrganisationQuery, useUpdateClaimStatusMutation } from "../../../slices/claimsApiSlice";
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const Claim = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isManager = userInfo?.role === "manager";

  // Get organization ID (same logic as Admin)
  const getOrganisationId = () => {
    if (userInfo?.organisationId) return userInfo.organisationId;
    if (userInfo?.user?.organisationId) return userInfo.user.organisationId;
    if (userInfo?.organisation?.id) return userInfo.organisation.id;
    if (userInfo?.organization?.id) return userInfo.organization.id;
    if (userInfo?.orgId) return userInfo.orgId;
    
    return null;
  };

  const organisationId = getOrganisationId();

  // Add a query to get manager's employee data to find organization
  const { data: managerData } = useGetEmployeeQuery(userInfo?.id, { 
    skip: !userInfo?.id || organisationId !== null 
  });

  // Use organization ID from manager data if not found in userInfo
  const finalOrganisationId = organisationId || 
                              managerData?.data?.employee?.organisationId || 
                              managerData?.data?.employee?.organisation?.id;

  // FIXED: Use finalOrganisationId instead of organisationId
  const { data: claimsData, isLoading, error, refetch } = useGetClaimsByOrganisationQuery(
    finalOrganisationId, 
    { skip: !finalOrganisationId }
  );
  
  const [updateClaimStatus] = useUpdateClaimStatusMutation();

  // Extract claims data
  const allClaims = claimsData?.data?.claims || [];

  // Debug console log
  console.log('Manager Claims Debug:', { 
    organisationId, 
    finalOrganisationId,
    managerData,
    claimsData, 
    allClaims,
    isLoading, 
    error,
    userInfo
  });

  // Handle claim status update
  const handleStatusUpdate = async (claimId, status) => {
    try {
      await updateClaimStatus({ 
        claimId, 
        status, 
        comment: `Status updated to ${status} by manager` 
      }).unwrap();
      toast.success(`Claim ${status.toLowerCase()} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to update claim status: ${error?.data?.message || error.message}`);
    }
  };

  // Prepare data for CSV download - FIXED: Safe access
  const csvData = allClaims.map((claim) => ({
    ReferenceID: claim.referenceId,
    EmployeeName: `${claim.employee?.firstName || ''} ${claim.employee?.lastName || ''}`,
    EventName: claim.eventName,
    Amount: claim.amount?.toLocaleString("en-US", { 
      style: "currency", 
      currency: claim.currency || "USD" 
    }),
    Status: claim.status,
    SubmittedDate: claim.submittedDate ? new Date(claim.submittedDate).toLocaleDateString() : 'N/A',
  })) || [];

  if (!isManager) {
    return <p className="text-center text-red-500">Unauthorized Access</p>;
  }

  // UPDATED: Organization ID validation using finalOrganisationId
  if (!finalOrganisationId) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <h3 className="font-semibold text-lg">Organization ID Not Found</h3>
              <p className="text-sm mt-2">Unable to determine your organization. Please contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg shadow-md">
            Manage Claims
          </h1>
          <p className="text-sm text-gray-600 mt-2">Organization ID: {finalOrganisationId}</p>
        </div>
        {allClaims.length > 0 && (
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All Claims</h2>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Debug info */}
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Manager Mode:</strong> Organization ID: {finalOrganisationId} | 
            <strong> Total Claims:</strong> {allClaims.length}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading claims...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              Error: {error?.data?.message || error?.message || "Failed to fetch claims"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : allClaims.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No claims found for organization {finalOrganisationId}</p>
            <p className="text-sm text-gray-500 mt-2">Claims will appear here once employees submit them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-4 text-sm text-gray-600">
              <strong>{allClaims.length}</strong> Claims Found
            </div>
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
                {allClaims.map((claim) => (
                  <tr key={claim.id || claim.referenceId} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.referenceId}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {claim.employee?.firstName && claim.employee?.lastName
                        ? `${claim.employee.firstName} ${claim.employee.lastName}`
                        : `Employee ID: ${claim.employeeId}`
                      }
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{claim.eventName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {/* FIXED: Safe access to amount */}
                      {claim.amount?.toLocaleString("en-US", {
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
                            : "bg-blue-100 text-blue-800"
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