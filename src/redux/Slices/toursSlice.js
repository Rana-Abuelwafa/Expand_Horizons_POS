import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

const getNonAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

export const fetchSliderTrips = createAsyncThunk(
  "tours/fetchSlider",
  async (lang, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        BASE_URL + "/GetTripsAll",
        {
          destination_id: 0,
          lang_code: lang || "en",
          show_in_top: false,
          show_in_slider: true,
          currency_code: "EUR",
        },
        getNonAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopTrips = createAsyncThunk(
  "tours/fetchTop",
  async (lang, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        BASE_URL + "/GetTripsAll",
        {
          destination_id: 0,
          lang_code: lang || "en",
          show_in_top: true,
          show_in_slider: false,
          currency_code: "EUR",
        },
        getNonAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "tours/toggleWishlist",
  async (tripId, { rejectWithValue }) => {
    try {
      // Here you would normally make an API call to update the wishlist
      // For now, we'll just return the tripId to toggle locally
      return tripId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const toursSlice = createSlice({
  name: "tours",
  initialState: {
    sliderTrips: [],
    topTrips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliderTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliderTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.sliderTrips = action.payload;
      })
      .addCase(fetchSliderTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.topTrips = action.payload;
      })
      .addCase(fetchTopTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const tripId = action.payload;
        // Toggle wishlist status for slider trips
        state.sliderTrips = state.sliderTrips.map((trip) =>
          trip.trip_id === tripId
            ? {
                ...trip,
                isfavourite: trip.isfavourite === "TRUE" ? "FALSE" : "TRUE",
              }
            : trip
        );
        // Toggle wishlist status for top trips
        state.topTrips = state.topTrips.map((trip) =>
          trip.trip_id === tripId
            ? {
                ...trip,
                isfavourite: trip.isfavourite === "TRUE" ? "FALSE" : "TRUE",
              }
            : trip
        );
      });
  },
});

export default toursSlice.reducer;
