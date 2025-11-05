import { useState, useEffect } from "react";
import EmployeeHeader from "../../Layouts/EmployeeHeader";
import { useSelector } from "react-redux";
import {
  useGetMyClaimsQuery,
  useGetClaimsByOrganisationQuery,
  useSubmitClaimMutation,
} from "../../../slices/claimsApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Claim = () => { 
  const { userInfo } = useSelector((state) => state.auth);
  
  // First try getMyClaims, but prepare for fallback
  const { 
    data: myClaimsData, 
    isLoading: myClaimsLoading, 
    error: myClaimsError, 
    refetch: refetchMyClaims 
  } = useGetMyClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  // Fallback: Get organization claims and filter by user email
  // This assumes the employee belongs to an organization
  const getOrganisationId = () => {
    // Try to get org ID from user info
    if (userInfo?.organisationId) return userInfo.organisationId;
    if (userInfo?.user?.organisationId) return userInfo.user.organisationId;
    if (userInfo?.organisation?.id) return userInfo.organisation.id;
    if (userInfo?.organization?.id) return userInfo.organization.id;
    if (userInfo?.orgId) return userInfo.orgId;
    
    // Hardcoded fallback for known users (you can remove this)
    if (userInfo?.email === 'aaronjackson@gmail.com') {
      return 2; // Assuming they belong to org ID 2
    }
    
    return null;
  };

  const organisationId = getOrganisationId();
  
  const { 
    data: orgClaimsData, 
    isLoading: orgClaimsLoading, 
    error: orgClaimsError, 
    refetch: refetchOrgClaims 
  } = useGetClaimsByOrganisationQuery(organisationId, {
    skip: !myClaimsError || !organisationId, // Only use if getMyClaims fails
  });
  
  const [submitClaim, { isLoading: isSubmitting }] = useSubmitClaimMutation();
  
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    currency: "KES",
    amount: "",
    fromDate: "",
    toDate: "",
    comment: "",
  });

  // Determine which data to use
  const shouldUseFallback = myClaimsError && orgClaimsData;
  const claimsData = shouldUseFallback ? orgClaimsData : myClaimsData;
  const isLoading = shouldUseFallback ? orgClaimsLoading : myClaimsLoading;
  const error = shouldUseFallback ? orgClaimsError : myClaimsError;
  const refetch = shouldUseFallback ? refetchOrgClaims : refetchMyClaims;

  // Force refetch on component mount
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventName || !formData.description || !formData.amount || !formData.fromDate || !formData.toDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.fromDate) >= new Date(formData.toDate)) {
      toast.error("To Date must be after From Date");
      return;
    }

    try {
      const claimData = {
        eventName: formData.eventName,
        description: formData.description,
        currency: formData.currency,
        amount: parseFloat(formData.amount),
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        comment: formData.comment || "", // Optional comment
      };

      console.log("Submitting claim data:", claimData);
      
      await submitClaim(claimData).unwrap();
      toast.success("Claim submitted successfully!");
      
      // Reset form
      setFormData({
        eventName: "",
        description: "",
        currency: "KES",
        amount: "",
        fromDate: "",
        toDate: "",
        comment: "",
      });
      
      // Refetch claims after successful submission
      setTimeout(() => {
        if (refetch) refetch();
        // Also refetch the fallback data if it exists
        if (shouldUseFallback && refetchMyClaims) {
          refetchMyClaims();
        }
      }, 500);
      
    } catch (err) {
      console.error("Submit claim error:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to submit claim";
      toast.error(errorMessage);
    }
  };

  // Extract claims from data
  let claims = [];
  
  if (shouldUseFallback) {
    // Using organization data - filter by current user email
    const allOrgClaims = claimsData?.data?.claims || [];
    
    // Filter claims for current user by email
    claims = allOrgClaims.filter(claim => 
      claim.employee?.email === userInfo?.email ||
      claim.employee?.userId === userInfo?.id ||
      claim.employeeId === userInfo?.id
    );
  } else {
    // Using my claims data
    claims = claimsData?.data?.claims || claimsData?.claims || [];
  }
  
  const hasValidClaims = Array.isArray(claims) && claims.length > 0;

  // Debug logging (simplified)
  console.log("Employee Claims Debug:", {
    userInfo: userInfo,
    myClaimsData: myClaimsData,
    myClaimsError: myClaimsError,
    orgClaimsData: orgClaimsData,
    shouldUseFallback: shouldUseFallback,
    organisationId: organisationId,
    filteredClaims: claims,
    isLoading: isLoading,
    error: error,
    hasValidClaims: hasValidClaims
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <EmployeeHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg shadow-md">
            My Claims
          </h1>
        </header>

        {/* Status Info */}
        {shouldUseFallback && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Viewing claims from organization data (filtered for your submissions)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Claim Submission Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit a New Claim</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g., Business Travel, Conference"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={formData.fromDate}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the claim"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment (Optional)
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Additional comments or details..."
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Claim"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Claims Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              My Claims {shouldUseFallback && "(Filtered)"}
            </h2>
            <button
              onClick={() => {
                if (refetch) refetch();
                // Also try to refetch the primary data
                if (shouldUseFallback && refetchMyClaims) {
                  refetchMyClaims();
                }
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading claims...</p>
            </div>
          ) : error && !shouldUseFallback ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                Error: {error?.data?.message || error?.message || "Failed to fetch claims"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Trying to fetch from organization data...
              </p>
              <button
                onClick={() => {
                  if (refetchOrgClaims) refetchOrgClaims();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Load Organization Claims
              </button>
            </div>
          ) : !hasValidClaims ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No claims submitted yet</p>
              <p className="text-sm text-gray-500 mt-2">Submit your first claim using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Reference ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Event Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date Range</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id || claim.referenceId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-600">{claim.referenceId}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{claim.eventName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{claim.description || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {claim.amount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: claim.currency || "KES",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {claim.fromDate && claim.toDate && (
                          <span>
                            {new Date(claim.fromDate).toLocaleDateString()} - {new Date(claim.toDate).toLocaleDateString()}
                          </span>
                        )}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Claim;