// src/redux/Slices/wishlistSlice.js
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
//   // console.log(user)
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

// Async thunk for fetching wishlist count
export const fetchWishlistCount = createAsyncThunk(
  "wishlist/fetchWishlistCount",
  async (clientId, { rejectWithValue }) => {
    if (!clientId) {
      return 0;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/GetWishListCount?clientId=` + clientId,
        {},
        getNoTokenAuthHeaders()
      );

      // Assuming the API returns a simple number like in your example
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      // Return 0 on error but don't show error to user for count
      return 0;
    }
  }
);

// Async thunk for fetching wishlist items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
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
        `${BOOKING_URL}/GetClientWishList`,
        params
        //getAuthHeaders()
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to fetch wishlist"
        );
      }

      return response.data;
    } catch (err) {
      // canceled request → do nothing (no error)
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }

      return rejectWithValue(err.response?.data);
    }
  }
);

// Async thunk for adding item to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (wishlistData, { rejectWithValue, dispatch }) => {
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
        `${BOOKING_URL}/AddTripToWishList`,
        wishlistData
        //getAuthHeaders()
      );

      // Refresh wishlist count after adding
      const clientId = getClientId();
      if (clientId) {
        dispatch(fetchWishlistCount(clientId));
      }

      // Check if the operation was successful
      if (response.data.success === false) {
        // Return the error message but don't reject - so we can show the popup
        return {
          success: false,
          error: response.data.errors || "Failed to add to wishlist",
          trip_id: wishlistData.trip_id,
        };
      }

      return {
        success: true,
        ...response.data,
        trip_id: wishlistData.trip_id,
      };
    } catch (err) {
      // 🟢 If Axios request was canceled: STOP LOADING without error
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return null; // => thunk status: fulfilled → loading stops
      }

      return rejectWithValue(err.response?.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null,
    operation: {
      loading: false,
      error: null,
      success: false,
    },
  },
  reducers: {
    resetWishlistOperation: (state) => {
      state.operation.loading = false;
      state.operation.error = null;
      state.operation.success = false;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.count = 0;
      state.loading = false;
      state.error = null;
    },

    updateWishlistCount: (state, action) => {
      state.count = action.payload;
    },
    // Reset count when user logs out
    resetWishlistCount: (state) => {
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist count
      .addCase(fetchWishlistCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload; // Store the count
      })
      .addCase(fetchWishlistCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.count = 0; // Reset count on error
      })
      // Fetch wishlist items
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
       
        state.operation.loading = true;
        state.operation.error = null;
        state.operation.success = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.operation.loading = false;
        if (action.payload === null) {
          // Request was canceled → do NOT update error or data
          return;
        }
        if (action.payload.success) {
          state.operation.error = null;
          state.operation.success = true;
        } else {
          // Handle successful response but operation failed
       
          state.operation.error = action.payload.error;
          state.operation.success = false;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        
        state.operation.loading = false;
        state.operation.error = action.payload;
        state.operation.success = false;
      });
  },
});

export const {
  resetWishlistOperation,
  clearWishlist,
  updateWishlistCount,
  resetWishlistCount,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
