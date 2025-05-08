import { apiSlice } from "./apiSlice"; // Assuming you have a common `apiSlice`
export const CHANGE_PASSWORD_URL = "/api/auth/change-password"// Update with your actual endpoint base URL

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: `${CHANGE_PASSWORD_URL}/change-password`, // Update with your actual change-password endpoint
        method: "POST",
        body: passwordData, // { currentPassword, newPassword, confirmPassword }
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = authApiSlice;
