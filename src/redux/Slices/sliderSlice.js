// features/slider/sliderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../api/axios";
const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

// const getAuthHeaders = () => {
//      let lang = localStorage.getItem("lang");
//     return {
//         headers: {
//             "Content-Type": "application/json",
//             "Accept-Language": lang
//         },
//     };
// };

export const fetchSliderTrips = createAsyncThunk(
  "slider/fetchSliderTrips",
  async (lang_code = "en", { rejectWithValue }) => {
    try {
      const response = await api.post(
        BASE_URL + "/GetTripsForSlider",
        {
          destination_id: 0,
          lang_code: lang_code,
          show_in_top: false,
          currency_code: "EUR",
        }
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    slides: [],
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
        state.slides = action.payload.map((trip) => ({
          id: trip.trip_id,
          image: trip.default_img,
          title: trip.trip_name,
          subtitle: trip.trip_description,
        }));
      })
      .addCase(fetchSliderTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sliderSlice.reducer;
