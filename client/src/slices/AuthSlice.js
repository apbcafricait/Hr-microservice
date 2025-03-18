// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null; // Clear user info
      localStorage.removeItem('userInfo'); // Remove from local storage
    },
  },
});

// Export actions
export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.userInfo; // Updated to reference userInfo
export const selectCurrentToken = (state) => state.auth.userInfo?.token; // Assuming token is part of userInfo

export default authSlice.reducer;