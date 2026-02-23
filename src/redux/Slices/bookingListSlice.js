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

const getNoTokenAuthHeaders = () => {
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Helper function to get client ID from localStorage
const getClientId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id || null;
};

// Async thunk for fetching booking count
export const fetchBookingCount = createAsyncThunk(
  "bookingList/fetchBookingCount",
  async (clientId, { rejectWithValue }) => {
    if (!clientId) {
      return 0;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/GetMyBookingCount?clientId=${clientId}`,
        {},
        getNoTokenAuthHeaders()
      );

      // Assuming the API returns a simple number like in your example
      return response.data;
    } catch (error) {
      console.error("Error fetching booking count:", error);
      // Return 0 on error but don't show error to user for count
      return 0;
    }
  }
);

// Async thunk for fetching booking items
export const fetchBookingList = createAsyncThunk(
  "bookingList/fetchBookingList",
  async (params, { rejectWithValue }) => {
    // Check authentication with proper scenario detection
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
        `${BOOKING_URL}/GetMyBooking`,
        params
        //getAuthHeaders()
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to fetch bookings"
        );
      }

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }
      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const bookingListSlice = createSlice({
  name: "bookingList",
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingList: (state) => {
      state.items = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
    },
    updateBookingCount: (state, action) => {
      state.count = action.payload;
    },
    // Reset count when user logs out
    resetBookingCount: (state) => {
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch booking count
      .addCase(fetchBookingCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload; // Store the count
      })
      .addCase(fetchBookingCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.count = 0; // Reset count on error
      })
      // Fetch booking items
      .addCase(fetchBookingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingList, updateBookingCount, resetBookingCount } =
  bookingListSlice.actions;
export default bookingListSlice.reducer;
