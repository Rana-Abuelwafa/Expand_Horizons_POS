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

// Async thunk to confirm booking
export const PrintTicketAPI = createAsyncThunk(
  "ticket/PrintTicket",
  async (TicketData, { rejectWithValue }) => {
    // Check authentication with proper scenario detection

    try {
      const response = await api.post(
        `${BOOKING_URL}/PrintTicket`,
        TicketData,
        //getAuthHeaders(),
      );

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const TicketPrintSlice = createSlice({
  name: "ticket",
  initialState: {
    loading: false,
    error: null,
    success: false,
    printed: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Confirm Booking
      .addCase(PrintTicketAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(PrintTicketAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.printed = action.payload === true;
      })
      .addCase(PrintTicketAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.printed = false;
      });
  },
});

export const {} = TicketPrintSlice.actions;
export default TicketPrintSlice.reducer;
