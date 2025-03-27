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
    }),

    // Fetch claims for the logged-in employee
    getMyClaims: builder.query({
      query: () => ({
        url: `${CLAIM_URL}/my-claims`,
        method: "GET",
      }),
    }),

    // Submit a new claim
    submitClaim: builder.mutation({
      query: (claimData) => ({
        url: `${CLAIM_URL}/submit`,
        method: "POST",
        body: claimData,
      }),
    }),

    // Assign a claim to an employee
    assignClaim: builder.mutation({
      query: (assignmentData) => ({
        url: `${CLAIM_URL}/assign`,
        method: "POST",
        body: assignmentData,
      }),
    }),

    // Update the status of a claim
    updateClaimStatus: builder.mutation({
      query: (statusData) => ({
        url: `${CLAIM_URL}/status`,
        method: "PUT",
        body: statusData,
      }),

  }),
})
});



export const {
  useGetAllClaimsQuery,
  useGetMyClaimsQuery,
  useSubmitClaimMutation,
  useAssignClaimMutation,
  useUpdateClaimStatusMutation,
} = claimsApiSlice;
