// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../../client/src/slices/apiSlice';
import authSliceReducer from '../src/slices/AuthSlice';
import { organizationSlice } from '../src/slices/organizationSlice';
import reportToReducer from '../../client/src/slices/ReportSlice';
import { qualificationSlice } from '../../client/src/slices/qualificationSlice'; 

const store = configureStore({
  reducer: {
    reportTo: reportToReducer, 
    [apiSlice.reducerPath]: apiSlice.reducer, 
    auth: authSliceReducer,
    [organizationSlice.reducerPath]: organizationSlice.reducer, 
    [qualificationSlice.reducerPath]: qualificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware) 
      .concat(organizationSlice.middleware) 
      .concat(qualificationSlice.middleware),
  devTools: true,
});

export default store;
