// UserApiSlice.js

import { apiSlice } from './apiSlice'; // Assuming you have a base apiSlice defined elsewhere

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
    // If you need other operations like fetching all users, add them here
    getAllUsers: builder.query({
      query: () => ({
        url: '/api/users',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useRegisterUserMutation, useLoginUserMutation, useGetAllUsersQuery } = userApiSlice;