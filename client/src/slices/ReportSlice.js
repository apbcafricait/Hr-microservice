// src/slices/ReportSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supervisors: [],
  subordinates: [],
  attachments: [],
};

const ReportSlice = createSlice({
  name: 'reportTo',
  initialState,
  reducers: {
    addSupervisor: (state, action) => {
      state.supervisors.push(action.payload);
    },
    addSubordinate: (state, action) => {
      state.subordinates.push(action.payload);
    },
    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
    },
    removeAttachment: (state, action) => {
      state.attachments = state.attachments.filter(
        (attachment) => attachment.fileName !== action.payload.fileName
      );
    },
  },
});

export const { addSupervisor, addSubordinate, addAttachment, removeAttachment } = ReportSlice.actions;
export default ReportSlice.reducer;
