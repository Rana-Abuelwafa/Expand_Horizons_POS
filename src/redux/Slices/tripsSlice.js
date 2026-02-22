import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// ---------- Thunks ----------
export const fetchSliderTrips = createAsyncThunk(
  "trips/fetchSliderTrips",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripsAll`,
        {
          ...params,
          show_in_slider: true,
          destination_id: 0, // Always 0 for slider
          client_id: "", // No client ID for slider
        },
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch slider trips failed");
    }
  }
);

export const fetchCarouselTrips = createAsyncThunk(
  "trips/fetchCarouselTrips",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripsAll`,
        {
          ...params,
          show_in_slider: true,
          destination_id: 0, // Always 0 for carousel
          client_id: "", // No client ID for carousel
        },
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch carousel trips failed");
    }
  }
);

export const fetchToursSectionTrips = createAsyncThunk(
  "trips/fetchToursSectionTrips",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripsAll`,
        {
          ...params,
          show_in_slider: false,
          destination_id: 0, // Always 0 for tours section
          // client_id is passed from params for personalized results
        },
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch tours section trips failed");
    }
  }
);

export const fetchDestinationTrips = createAsyncThunk(
  "trips/fetchDestinationTrips",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripsAll`,
        {
          ...params,
          show_in_slider: false, // Always false for destination trips
          // client_id is passed from params for personalized results
        },
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch destination trips failed");
    }
  }
);

export const fetchPickupsForTrip = createAsyncThunk(
  "trips/fetchPickupsForTrip",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetPickupsForTrip`,
        params,
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch pickups failed");
    }
  }
);

// ---------- Slice ----------
const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    sliderTrips: [],
    carouselTrips: [],
    toursSectionTrips: [],
    destinationTrips: [],
    pickupsByTrip: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDestinationTrips: (state) => {
      state.destinationTrips = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Slider Trips
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

      // Carousel Trips
      .addCase(fetchCarouselTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarouselTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.carouselTrips = action.payload;
      })
      .addCase(fetchCarouselTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tours Section Trips
      .addCase(fetchToursSectionTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursSectionTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.toursSectionTrips = action.payload;
      })
      .addCase(fetchToursSectionTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Destination Trips
      .addCase(fetchDestinationTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinationTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.destinationTrips = action.payload;
      })
      .addCase(fetchDestinationTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pickups
      .addCase(fetchPickupsForTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupsForTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.pickupsByTrip = action.payload;
      })
      .addCase(fetchPickupsForTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDestinationTrips, clearError } = tripsSlice.actions;
export default tripsSlice.reducer;
