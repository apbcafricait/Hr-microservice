import { EMPLOYEE_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all employees
    getAllEmployees: builder.query({
      query: () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${EMPLOYEE_URL}`,
          method: "GET",
         
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ['Employee'],
    }),

    // Create a new employee
    createEmployee: builder.mutation({
      query: (body) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${EMPLOYEE_URL}`,
          method: "POST",
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ['Employee'],
    }),

    // Update an existing employee
    updateEmployee: builder.mutation({
      query: ({ id, body }) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${EMPLOYEE_URL}/${id}`,
          method: "PUT",
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ['Employee'],
    }),

    // Delete an employee
    deleteEmployee: builder.mutation({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${EMPLOYEE_URL}/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApiSlice;