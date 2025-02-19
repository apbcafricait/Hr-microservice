import { QUALIFICATIONS_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const qualificationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQualifications: builder.query({
      query: (args = {}) => {
        const { page = 1, limit = 10, search } = args;
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (search) queryParams.append("search", search);

        return {
          url: `${QUALIFICATIONS_URL}?${queryParams.toString()}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Qualifications"],
    }),
    
    // Create a new qualification
    createQualification: builder.mutation({
      query: (qualificationData) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${QUALIFICATIONS_URL}`,
          method: "POST",
          body: qualificationData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Qualifications"],
    }),

    // Update an existing qualification
    updateQualification: builder.mutation({
      query: ({ id, updatedData }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${QUALIFICATIONS_URL}/${id}`,
          method: "PUT",
          body: updatedData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Qualifications"],
    }),

    // Delete a qualification
    deleteQualification: builder.mutation({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${QUALIFICATIONS_URL}/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Qualifications"],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllQualificationsQuery,
  useCreateQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} = qualificationSlice;
