<<<<<<< HEAD
import { createSlice } from "@reduxjs/toolkit";

// Load user and token from localStorage safely
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  user:  null,
  token: null,
};
=======
// authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  user: null,
  status: 'idle',
  error: null
}
>>>>>>> ef3225f79777507f32da2d00793167843ddb22d0

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
<<<<<<< HEAD
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
=======
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    }
  }
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
>>>>>>> ef3225f79777507f32da2d00793167843ddb22d0


export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
