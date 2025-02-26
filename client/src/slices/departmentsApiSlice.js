import { apiSlice } from '../slices/apiSlice'

export const departmentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDepartments: builder.query({
      query: organisationId => `api/departments/organisation/${organisationId}`,
      providesTags: ['Departments']
    }),
    getDepartment: builder.query({
      query: id => `api/departments/${id}`,
      providesTags: ['Department']
    }),
    createDepartment: builder.mutation({
      query: ({ organisationId, data }) => ({
        url: `api/departments/organisation/${organisationId}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Departments']
    }),
    updateDepartment: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/departments/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Departments', 'Department']
    }),
    deleteDepartment: builder.mutation({
      query: id => ({
        url: `api/departments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Departments']
    }),
    assignEmployees: builder.mutation({
      query: ({ id, employees }) => ({
        url: `api/departments/${id}/assign-employees`,
        method: 'POST',
        body: { employees }
      }),
      invalidatesTags: ['Departments', 'Department']
    })
  })
})

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useAssignEmployeesMutation
} = departmentApiSlice
