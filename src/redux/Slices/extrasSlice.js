// src/redux/Slices/extrasSlice.js
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

// Async thunk to get trip extras
export const getTripExtras = createAsyncThunk(
  "extras/getTripExtras",
  async (tripData, { rejectWithValue }) => {
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
        `${BOOKING_URL}/GetTrip_Extra_Mains`,
        tripData
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

// Async thunk to assign extras to booking
export const assignExtraToBooking = createAsyncThunk(
  "extras/assignExtraToBooking",
  async (extraData, { rejectWithValue }) => {
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
        `${BOOKING_URL}/AssignExtraToBooking`,
        extraData
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

const extrasSlice = createSlice({
  name: "extras",
  initialState: {
    loading: false,
    error: null,
    tripExtras: [],
    assignedExtras: [],
    pickupLocation: null,
  },
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    clearExtrasData: (state) => {
      state.loading = false;
      state.error = null;
      state.tripExtras = [];
      state.assignedExtras = [];
      state.pickupLocation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Trip Extras
      .addCase(getTripExtras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripExtras.fulfilled, (state, action) => {
        state.loading = false;
        state.tripExtras = action.payload;
      })
      .addCase(getTripExtras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign Extra to Booking
      .addCase(assignExtraToBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignExtraToBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.assignedExtras.push(action.meta.arg);
        }
      })
      .addCase(assignExtraToBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPickupLocation, clearExtrasData, clearError } =
  extrasSlice.actions;
export default extrasSlice.reducer;
