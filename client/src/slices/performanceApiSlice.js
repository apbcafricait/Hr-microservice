import { PERFORMANCE_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const performanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all performance reviews
    getAllPerformanceReviews: builder.query({
      query: () => ({
        url: `${PERFORMANCE_URL}/performance-reviews`,
        method: "GET",
      }),
    }),

    // Fetch a single performance review by ID
    getPerformanceReview: builder.query({
      query: (id) => ({
        url: `${PERFORMANCE_URL}/performance-reviews/${id}`,
        method: "GET",
      }),
    }),

    // Create a new performance review
    createPerformanceReview: builder.mutation({
      query: (reviewData) => ({
        url: `${PERFORMANCE_URL}/performance-reviews`,
        method: "POST",
        body: reviewData,
      }),
    }),

    // Update an existing performance review
    updatePerformanceReview: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${PERFORMANCE_URL}/performance-reviews/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    // Delete a performance review
    deletePerformanceReview: builder.mutation({
      query: (id) => ({
        url: `${PERFORMANCE_URL}/performance-reviews/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllPerformanceReviewsQuery,
  useGetPerformanceReviewQuery,
  useCreatePerformanceReviewMutation,
  useUpdatePerformanceReviewMutation,
  useDeletePerformanceReviewMutation,
} = performanceApiSlice;
