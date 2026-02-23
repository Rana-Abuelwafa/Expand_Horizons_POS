// src/redux/Slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;
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

const getNonAuthHeaders = () => {
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Async thunk for fetching reviews
export const fetchClientsReviews = createAsyncThunk(
  "reviews/fetchClientsReviews",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/GetClientsReviews`,
        params,
        getNonAuthHeaders()
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to fetch reviews"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

// Async thunk for submitting a review
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
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
        `${BOOKING_URL}/SaveReviewForTrip`,
        reviewData
        //getAuthHeaders()
      );

      // Check if the response indicates a duplicate submission
      if (response.data.success === false) {
        return rejectWithValue({
          message:
            response.data.msg ||
            response.data.errors ||
            "Duplicate review submission",
          status: 400,
          errors: [response.data.errors || "Duplicate data"],
          isDuplicate: true,
        });
      }

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle case where server returns error with success: false in response data
      if (error.response?.data?.success === false) {
        return rejectWithValue({
          message:
            error.response.data.msg ||
            error.response.data.errors ||
            "Duplicate review submission",
          status: error.response.status,
          errors: [error.response.data.errors || "Duplicate data"],
          isDuplicate: true,
        });
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewsByTrip: {},
    loading: false,
    error: null,
    submission: {
      loading: false,
      error: null,
      success: false,
      isDuplicate: false,
    },
  },
  reducers: {
    resetReviewSubmission: (state) => {
      state.submission.loading = false;
      state.submission.error = null;
      state.submission.success = false;
      state.submission.isDuplicate = false;
    },
    clearReviews: (state) => {
      state.reviewsByTrip = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchClientsReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientsReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { trip_id } = action.meta.arg;
        state.reviewsByTrip[trip_id] = action.payload;
      })
      .addCase(fetchClientsReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submission.loading = true;
        state.submission.error = null;
        state.submission.success = false;
        state.submission.isDuplicate = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submission.loading = false;
        state.submission.error = null;
        state.submission.success = true;
        state.submission.isDuplicate = false;

        // Add the new review to the state if possible
        if (action.payload.review) {
          const tripId = action.meta.arg.trip_id;
          if (!state.reviewsByTrip[tripId]) {
            state.reviewsByTrip[tripId] = { reviews: [] };
          }
          state.reviewsByTrip[tripId].reviews.unshift(action.payload.review);
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submission.loading = false;
        state.submission.error = action.payload;
        state.submission.success = false;
        state.submission.isDuplicate = action.payload?.isDuplicate || false;
      });
  },
});

export const { resetReviewSubmission, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
