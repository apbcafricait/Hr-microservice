import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: '/api/users',
        method: 'POST',
        body: credentials,
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getUsers: builder.query({
      query: (params) => ({
        url: '/api/users',
        method: 'GET',
        params: params,
      }),
      providesTags: ['Users'],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} = userApiSlice;