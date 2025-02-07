// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../client/src/slices/apiSlice';
import authSliceReducer from '../src/slices/AuthSlice';
import { organizationSlice } from '../src/slices/organizationSlice'; // ✅ Use named import

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    [organizationSlice.reducerPath]: organizationSlice.reducer, // ✅ Ensure correct reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, organizationSlice.middleware), // ✅ Ensure middleware is included
  devTools: true,
});

export default store;
