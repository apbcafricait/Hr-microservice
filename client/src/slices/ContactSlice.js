// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios"; // Or your preferred HTTP client

// const initialState = {
//   contactDetails: null,
//   attachments: [],
//   loading: false,
//   error: null,
// };

// // Async Thunks
// export const getContactDetails = createAsyncThunk(
//   "contact/getContactDetails",
//   async () => {
//     try {
//       const response = await axios.get("/api/contact"); // Replace with your API endpoint
//       return response.data;
//     } catch (error) {
//       throw error.response.data.message || error.message; // Re-throw the error for the rejected case
//     }
//   }
// );

// export const updateContactDetails = createAsyncThunk(
//   "contact/updateContactDetails",
//   async (contactData) => {
//     try {
//       const response = await axios.put("/api/contact", contactData); // Replace with your API endpoint
//       return response.data;
//     } catch (error) {
//       throw error.response.data.message || error.message;
//     }
//   }
// );

// export const uploadAttachments = createAsyncThunk(
//   "contact/uploadAttachments",
//   async (formData) => {
//     try {
//       const response = await axios.post("/api/attachments", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response.data.message || error.message;
//     }
//   }
// );


// export const getAttachments = createAsyncThunk(
//     "contact/getAttachments",
//     async () => {
//       try {
//         const response = await axios.get("/api/attachments"); // Replace with your API endpoint
//         return response.data;
//       } catch (error) {
//         throw error.response.data.message || error.message;
//       }
//     }
//   );


// const contactSlice = createSlice({
//   name: "contact",
//   initialState,
//   reducers: {}, // You might have some regular reducers here if needed
//   extraReducers: (builder) => {
//     // Get Contact Details
//     builder.addCase(getContactDetails.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(getContactDetails.fulfilled, (state, action) => {
//       state.loading = false;
//       state.contactDetails = action.payload;
//     });
//     builder.addCase(getContactDetails.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.error.message; // Set the error message
//     });

//     // Update Contact Details
//     builder.addCase(updateContactDetails.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(updateContactDetails.fulfilled, (state, action) => {
//       state.loading = false;
//       state.contactDetails = action.payload; // Update contact details in the state
//     });
//     builder.addCase(updateContactDetails.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.error.message;
//     });

//     // Upload Attachments
//     builder.addCase(uploadAttachments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       });
//       builder.addCase(uploadAttachments.fulfilled, (state) => {
//         state.loading = false;
//       });
//       builder.addCase(uploadAttachments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // Get Attachments
//     builder.addCase(getAttachments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       });
//       builder.addCase(getAttachments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.attachments = action.payload;
//       });
//       builder.addCase(getAttachments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;