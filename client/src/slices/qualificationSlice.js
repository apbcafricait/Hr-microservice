import { QUALIFICATIONS_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const qualificationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQualifications: builder.query({
      query: (args = {}) => {
        const { page = 1, limit = 10, search, employeeId } = args;
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (search) queryParams.append("search", search);
        if (employeeId) queryParams.append("employeeId", employeeId);

        return {
          url: `${QUALIFICATIONS_URL}?${queryParams.toString()}`,
          method: "GET",
          credentials: 'include', // ✅ Send cookies instead
        };
      },
      providesTags: ["Qualifications"],
    }),

    createQualification: builder.mutation({
      query: (qualificationData) => ({
        url: `${QUALIFICATIONS_URL}`,
        method: "POST",
        body: qualificationData,
        credentials: 'include', // ✅ Send cookies instead
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Qualifications"],
    }),

    updateQualification: builder.mutation({
      query: (qualificationData) => {
        const { id, ...updatedFields } = qualificationData;
        return {
          url: `${QUALIFICATIONS_URL}/${id}`,
          method: "PUT",
          body: updatedFields,
          credentials: 'include', // ✅ Send cookies instead
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Qualifications"],
    }),

    deleteQualification: builder.mutation({
      query: (id) => ({
        url: `${QUALIFICATIONS_URL}/${id}`,
        method: "DELETE",
        credentials: 'include', // ✅ Send cookies instead
      }),
      invalidatesTags: ["Qualifications"],
    }),
  }),
});

export const {
  useGetAllQualificationsQuery,
  useCreateQualificationMutation,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} = qualificationSlice;