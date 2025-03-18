// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../../client/src/slices/apiSlice";
import authSliceReducer from "../src/slices/AuthSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Integrate the apiSlice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Include apiSlice middleware
});

export default store;
