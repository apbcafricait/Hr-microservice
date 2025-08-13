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

    // Update the status of a claim
    updateClaimStatus: builder.mutation({
      query: (statusData) => ({
        url: `${CLAIM_URL}/status`,
        method: "PUT",
        body: statusData,
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
} = claimsApiSlice;