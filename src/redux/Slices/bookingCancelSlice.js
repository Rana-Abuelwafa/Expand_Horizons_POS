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
//   const user = JSON.parse(localStorage.getItem("user"));
//   const accessToken = user?.accessToken;
//   let lang = localStorage.getItem("lang") || "en";
//   return {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//       "Accept-Language": lang,
//     },
//   };
// };

// Async thunk for canceling booking
export const cancelBooking = createAsyncThunk(
  "bookingCancel/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
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
        `${BOOKING_URL}/CancelBooking?booking_id=${bookingId}`
        // {},
        // getAuthHeaders()
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to cancel booking"
        );
      }

      return { bookingId, response: response.data };
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }
      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const bookingCancelSlice = createSlice({
  name: "bookingCancel",
  initialState: {
    loading: false,
    error: null,
    success: false,
    canceledBookingId: null,
  },
  reducers: {
    clearCancelState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.canceledBookingId = null;
    },
    resetCancelStatus: (state) => {
      state.success = false;
      state.canceledBookingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.canceledBookingId = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.canceledBookingId = action.payload.bookingId;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.canceledBookingId = null;
      });
  },
});

export const { clearCancelState, resetCancelStatus } =
  bookingCancelSlice.actions;
export default bookingCancelSlice.reducer;
