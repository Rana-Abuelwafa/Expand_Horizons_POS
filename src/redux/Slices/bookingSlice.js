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
const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

// Builds authenticated JSON headers for booking endpoints.
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

// Creates/updates a booking draft and returns availability + booking IDs.
export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async (bookingData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/SaveClientBooking`,
        bookingData,
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to check availability",
        );
      }

      return response.data;
    } catch (error) {

      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    loading: false,
    error: null,
    success: false,
    availabilityData: null,
  },
  reducers: {
    // Resets booking request state after completion or cancellation.
    resetBookingOperation: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.availabilityData = null;
    },
    clearBookingData: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.availabilityData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.availabilityData = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetBookingOperation, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
