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

// Async thunk to fetch user profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
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
      // Make API call to get client profiles
      const response = await api.post(
        BOOKING_URL + "/GetClientProfiles"
        // {},
        // getAuthHeaders()
      );

      return response.data?.[0] || {};
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

// Async thunk to save profile data
export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (formData, { rejectWithValue }) => {
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
      // Make API call to save profile
      const response = await api.post(
        BOOKING_URL + "/SaveMainProfile",
        formData
        //getAuthHeaders()
      );

      if (response.data.success == false) {
        return rejectWithValue(response.data.errors || "Operation failed");
      }

      // Return both API response and form data
      return {
        success: response.data.success,
        formData: formData,
        message: response.data.errors,
      };
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

// Async thunk to fetch profile image
export const fetchProfileImage = createAsyncThunk(
  "profile/fetchProfileImage",
  async (_, { rejectWithValue }) => {
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
      // Make API call to get profile image
      const response = await api.post(
        BOOKING_URL + "/GetProfileImage"
        // {},
        // getAuthHeaders()
      );

      return response.data?.[0]?.img_path || null;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

// Async thunk to upload profile image
export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (imageFile, { rejectWithValue }) => {
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
      const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = user?.accessToken;
      const requestBody = { img: imageFile };

      // Make API call to upload image with multipart/form-data
      const response = await api.post(
        BOOKING_URL + "/saveProfileImage",
        requestBody,
        { isFormData: true }
        // {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );

      // Return both object URL for immediate display and API response
      return {
        success: response.data.success,
        url: URL.createObjectURL(imageFile),
        message: response.data.errors,
      };
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

export const GetClient_Notification_Settings = createAsyncThunk(
  "profile/GetClient_Notification_Settings",
  async (formData, { rejectWithValue }) => {
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
        `${BOOKING_URL}/GetClient_Notification_Settings`,
        formData
        //getAuthHeaders()
      );

      // Handle API response with success: false
      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to get notification setting"
        );
      }

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

export const SaveClientNotificationSetting = createAsyncThunk(
  "profile/SaveClientNotificationSetting",
  async (formData, { rejectWithValue }) => {
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
        `${BOOKING_URL}/SaveClientNotificationSetting`,
        formData
        //getAuthHeaders()
      );

      // Handle API response with success: false
      if (response.data.success === false) {
        return rejectWithValue(response.data.errors || "Failed to get Data");
      }

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);
// Create profile slice with reducers and extra reducers for async actions
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: {},
    profileImage: null,
    Notifications: [],
    loading: false,
    error: null,
    success: null,
    message: null, // For API response messages
  },
  reducers: {
    // Action to reset success/error states
    resetProfileStatus: (state) => {
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })

      // Save Profile cases
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.profileData = {
          ...action.payload.formData,
          profile_id: action.payload.formData.profile_id || 0,
        };
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload;
      })

      // Fetch Profile Image cases
      .addCase(fetchProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(fetchProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profileImage = action.payload;
      })
      .addCase(fetchProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload;
      })

      // Upload Profile Image cases
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.success) {
          state.profileImage = action.payload.url;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(GetClient_Notification_Settings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(GetClient_Notification_Settings.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.Notifications = action.payload;
      })
      .addCase(GetClient_Notification_Settings.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(SaveClientNotificationSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(SaveClientNotificationSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(SaveClientNotificationSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;
