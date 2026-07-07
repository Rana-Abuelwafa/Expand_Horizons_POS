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

// Builds auth headers for booking confirmation requests.
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

// Finalizes the booking after validation and summary steps succeed.
export const confirmBooking = createAsyncThunk(
  "confirm/confirmBooking",
  async (confirmData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/ConfirmBookingPos`,
        confirmData,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const confirmSlice = createSlice({
  name: "confirm",
  initialState: {
    loading: false,
    error: null,
    success: false,
    confirmed: false,
  },
  reducers: {
    // Resets confirmation state before a new confirmation attempt.
    resetConfirmState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.confirmed = false;
    },
    clearConfirmError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.confirmed = action.payload === true;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.confirmed = false;
      });
  },
});

export const { resetConfirmState, clearConfirmError } = confirmSlice.actions;
export default confirmSlice.reducer;
