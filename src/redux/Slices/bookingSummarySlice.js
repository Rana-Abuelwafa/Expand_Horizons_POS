// src/redux/Slices/bookingSummarySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// const getAuthHeaders = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const accessToken = user?.accessToken;
//     let lang = localStorage.getItem("lang") || "en";
//     return {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//             "Accept-Language": lang,
//         },
//     };
// };

// Async thunk to get booking summary
export const getBookingSummary = createAsyncThunk(
  "bookingSummary/getBookingSummary",
  async (bookingData, { rejectWithValue }) => {
    // Check authentication
    // if (isUserNotLoggedIn()) {
    //   return rejectWithValue(createAuthError("notLoggedIn"));
    // }

    // if (isTokenExpiredOnly()) {
    //   return rejectWithValue(createAuthError("expired"));
    // }

    // if (!checkAUTH()) {
    //   return rejectWithValue(createAuthError("expired"));
    // }

    try {
      const response = await api.post(
        `${BOOKING_URL}/GetBookingSummary`,
        bookingData
        //getAuthHeaders()
      );

      return response.data;
    } catch (error) {
      //   if (error.response?.status === 401) {
      //     return rejectWithValue(createAuthError("expired"));
      //   }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bookingSummarySlice = createSlice({
  name: "bookingSummary",
  initialState: {
    loading: false,
    error: null,
    summaryData: null,
    shouldRefresh: false,
  },
  reducers: {
    clearBookingSummary: (state) => {
      state.loading = false;
      state.error = null;
      state.summaryData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    triggerRefresh: (state) => {
      state.shouldRefresh = true; // Add this flag to your initialState
    },
    clearRefresh: (state) => {
      state.shouldRefresh = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Booking Summary
      .addCase(getBookingSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryData = action.payload;
      })
      .addCase(getBookingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingSummary, clearError, triggerRefresh, clearRefresh } =
  bookingSummarySlice.actions;
export default bookingSummarySlice.reducer;
