import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useGetClaimsByOrganisationQuery, useUpdateClaimStatusMutation } from "../../../slices/claimsApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

import { getStatusBadgeConfig,getUserDisplayName,getOrganizationId } from '../../../../../backend/utils/organiationUtils';
const Claim = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isManager = userInfo?.role === "manager";

  // Debug: Log userInfo structure
  console.log('UserInfo structure:', userInfo);

  // Get organisation ID using utility function
  const organisationId = getOrganizationId(userInfo);
  
  // Debug: Log resolved organisation ID
  console.log('Resolved organisationId:', organisationId);

  const { 
    data: claimsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetClaimsByOrganisationQuery(organisationId, { 
    skip: !organisationId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  
  const [updateClaimStatus] = useUpdateClaimStatusMutation();

  // Auto-refetch every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (organisationId) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, organisationId]);

  const allClaims = claimsData?.data?.claims || [];

  const handleStatusUpdate = async (claimId, status) => {
    try {
      await updateClaimStatus({ 
        claimId, 
        status, 
        comment: `Status updated to ${status} by manager` 
      }).unwrap();
      toast.success(`Claim ${status.toLowerCase()} successfully`);
      // Refetch will happen automatically due to cache invalidation
    } catch (error) {
      toast.error(`Failed to update claim status: ${error?.data?.message || error.message}`);
    }
  };

  const csvData = allClaims.map((claim) => ({
    ReferenceID: claim.referenceId,
    EmployeeName: getUserDisplayName(claim.employee),
    EventName: claim.eventName,
    Amount: claim.amount?.toLocaleString("en-US", { 
      style: "currency", 
      currency: claim.currency || "USD" 
    }),
    Status: getStatusBadgeConfig(claim.status).label,
    SubmittedDate: claim.submittedDate ? new Date(claim.submittedDate).toLocaleDateString() : 'N/A',
  })) || [];

  if (!isManager) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-700">You don't have manager permissions to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!organisationId) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <h3 className="font-semibold text-lg">organisation ID Not Found</h3>
              <p className="text-sm mt-2">Unable to determine your organisation. Please contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg shadow-md">
            Manage Claims
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            organisation ID: {organisationId} | Total Claims: {allClaims.length}
          </p>
        </div>
        {allClaims.length > 0 && (
          <CSVLink
            data={csvData}
            filename={`claims_org_${organisationId}_${new Date().toISOString().split("T")[0]}.csv`}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Download Claims
          </CSVLink>
        )}
      </header>

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

        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Manager Mode:</strong> organisation: {organisationId} | 
            <strong> Total Claims:</strong> {allClaims.length} | 
            <strong> Last Updated:</strong> {new Date().toLocaleTimeString()}
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
            <p className="text-gray-600">No claims found for organisation {organisationId}</p>
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
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date Range</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allClaims.map((claim) => {
                  const statusConfig = getStatusBadgeConfig(claim.status);
                  return (
                    <tr key={claim.id || claim.referenceId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-600 font-mono">{claim.referenceId}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{getUserDisplayName(claim.employee)}</div>
                          {claim.employee?.email && (
                            <div className="text-xs text-gray-500">{claim.employee.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{claim.eventName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        <div className="max-w-xs truncate" title={claim.description}>
                          {claim.description || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 font-semibold">
                        {claim.amount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: claim.currency || "USD",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {claim.fromDate && claim.toDate ? (
                          <div className="text-xs">
                            <div>{new Date(claim.fromDate).toLocaleDateString()}</div>
                            <div className="text-gray-400">to</div>
                            <div>{new Date(claim.toDate).toLocaleDateString()}</div>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
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
                        {(claim.status === "APPROVED" || claim.status === "REJECTED") && (
                          <span className="text-xs text-gray-500">
                            Action completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claim;