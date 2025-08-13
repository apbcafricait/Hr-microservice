import { CLAIM_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const claimsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all claims for an admin
    getAllClaims: builder.query({
      query: (filters) => ({
        url: `${CLAIM_URL}/all`,
        method: "POST",
        body: filters,
      }),
      providesTags: ['Claims'],
    }),

    // Fetch claims by organization ID (NEW - for Admin Dashboard)
    getClaimsByOrganisation: builder.query({
      query: (organisationId) => ({
        url: `${CLAIM_URL}/organisation/${organisationId}`,
        method: "GET",
      }),
      providesTags: ['Claims'],
    }),

    // Fetch claims for the logged-in employee
    getMyClaims: builder.query({
      query: () => ({
        url: `${CLAIM_URL}/my-claims`,
        method: "GET",
      }),
      providesTags: ['Claims'],
    }),

    // Submit a new claim
    submitClaim: builder.mutation({
      query: (claimData) => ({
        url: `${CLAIM_URL}/submit`,
        method: "POST",
        body: claimData,
      }),
      invalidatesTags: ['Claims'],
    }),

    // Assign a claim to an employee
    assignClaim: builder.mutation({
      query: (assignmentData) => ({
        url: `${CLAIM_URL}/assign`,
        method: "POST",
        body: assignmentData,
      }),
      invalidatesTags: ['Claims'],
    }),

    // Update the status of a claim (CORRECTED URL STRUCTURE)
    updateClaimStatus: builder.mutation({
      query: ({ claimId, status, comment }) => ({
        url: `${CLAIM_URL}/${claimId}/status`,
        method: "PUT",
        body: { status, comment },
      }),
      invalidatesTags: ['Claims'],
    }),

    // Alternative update claim mutation (if you need a different endpoint)
    updateClaim: builder.mutation({
      query: ({ claimId, ...updateData }) => ({
        url: `${CLAIM_URL}/${claimId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ['Claims'],
    }),

    // Get claim by ID (useful for viewing details)
    getClaimById: builder.query({
      query: (claimId) => ({
        url: `${CLAIM_URL}/${claimId}`,
        method: "GET",
      }),
      providesTags: (result, error, claimId) => [{ type: 'Claims', id: claimId }],
    }),

    // Delete claim (if needed)
    deleteClaim: builder.mutation({
      query: (claimId) => ({
        url: `${CLAIM_URL}/${claimId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Claims'],
    }),
  }),
});

export const {
  useGetAllClaimsQuery,
  useGetClaimsByOrganisationQuery,
  useGetMyClaimsQuery,
  useSubmitClaimMutation,
  useAssignClaimMutation,
  useUpdateClaimStatusMutation,
  useUpdateClaimMutation,
  useGetClaimByIdQuery,
  useDeleteClaimMutation,
} = claimsApiSlice;