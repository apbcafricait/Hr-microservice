import { CLAIM_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const claimsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all claims for an admin with filtering
    getAllClaims: builder.query({
      query: (filters = {}) => ({
        url: `${CLAIM_URL}/all`,
        method: "POST",
        body: filters,
      }),
      providesTags: ['Claims'],
    }),

    // Fetch claims by organization ID
    getClaimsByOrganisation: builder.query({
      query: (organisationId) => ({
        url: `${CLAIM_URL}/organisation/${organisationId}`,
        method: "GET",
      }),
      providesTags: (result, error, organisationId) => [
        'Claims', 
        { type: 'OrganizationClaims', id: organisationId }
      ],
    }),

    // Fetch claims for the logged-in employee
    getMyClaims: builder.query({
      query: () => ({
        url: `${CLAIM_URL}/my-claims`,
        method: "GET",
      }),
      providesTags: ['Claims', 'MyClaims'],
    }),

    // Submit a new claim
    submitClaim: builder.mutation({
      query: (claimData) => ({
        url: `${CLAIM_URL}/submit`,
        method: "POST",
        body: claimData,
      }),
      invalidatesTags: ['Claims', 'MyClaims'],
      // Optimistically update the cache
      async onQueryStarted(claimData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Invalidate organization claims for real-time updates
          if (claimData.organisationId) {
            dispatch(
              claimsApiSlice.util.invalidateTags([
                { type: 'OrganizationClaims', id: claimData.organisationId }
              ])
            );
          }
        } catch {}
      },
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

    // Update the status of a claim - FIXED ROUTE
    updateClaimStatus: builder.mutation({
      query: ({ claimId, status, comment }) => ({
        url: `${CLAIM_URL}/status`,
        method: "PUT",
        body: { claimId, status, comment },
      }),
      invalidatesTags: ['Claims', 'MyClaims'],
      // Optimistically update for real-time changes
      async onQueryStarted({ claimId, status, comment }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate all claims to ensure all users see the update
          dispatch(claimsApiSlice.util.invalidateTags(['Claims', 'MyClaims']));
        } catch {}
      },
    }),

    // Get claim by ID
    getClaimById: builder.query({
      query: (claimId) => ({
        url: `${CLAIM_URL}/${claimId}`,
        method: "GET",
      }),
      providesTags: (result, error, claimId) => [
        { type: 'Claims', id: claimId }
      ],
    }),

    // Delete claim
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
  useGetClaimByIdQuery,
  useDeleteClaimMutation,
} = claimsApiSlice;