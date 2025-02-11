// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../client/src/slices/apiSlice';
import authSliceReducer from '../src/slices/AuthSlice';
import { organizationSlice } from '../src/slices/organizationSlice';
import reportToReducer from '..//../client/src/slices/ReportSlice';
import qualificationsReducer from '../../client/src/slices/qualificationSlice';

const store = configureStore({
  reducer: {
    reportTo: reportToReducer, // Use the reducer directly
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    [organizationSlice.reducerPath]: organizationSlice.reducer,
    qualifications: qualificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(organizationSlice.middleware),
  devTools: true,
});

export default store;
