import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
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

const getNonAuthHeaders = () => {
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Async thunk for fetching trip details
export const fetchTripDetails = createAsyncThunk(
  "tripDetails/fetchTripDetails",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/GetTripDetails`,
        params,
        getNonAuthHeaders()
      );
      
      if (response.data.success === false) {
        return rejectWithValue(response.data.errors || "Failed to fetch trip details");
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const tripDetailsSlice = createSlice({
  name: "tripDetails",
  initialState: {
    tripData: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearTripDetails: (state) => {
      state.tripData = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    updateTripDetails: (state, action) => {
      if (state.tripData) {
        state.tripData = { ...state.tripData, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tripData = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchTripDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tripData = null;
      });
  },
});

export const { clearTripDetails, updateTripDetails } = tripDetailsSlice.actions;
export default tripDetailsSlice.reducer;