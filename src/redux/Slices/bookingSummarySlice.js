import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// Builds auth headers for summary endpoints.
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Loads calculated booking totals and breakdown for checkout.
export const getBookingSummary = createAsyncThunk(
  "bookingSummary/getBookingSummary",
  async (bookingData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/GetBookingSummary`,
        bookingData,
      );

      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  },
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
    // Clears cached summary when leaving checkout flow.
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
