import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import {
//   checkAUTH,
//   isUserNotLoggedIn,
//   isTokenExpiredOnly,
// } from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;

const NonAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    "Accept-Language": lang,
  };
};
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
const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
  success: null,
  message: null,
};

// Helper to extract error message from different response formats
const getErrorMessage = (error) => {
  /// console.log("error.response?.data ", error.response?.data);
  if (error.response?.data?.success === false) {
    return error.response.data.errors || "Operation failed";
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred";
};
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { userId, oldPassword, newPassword, confirmNewPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        BASE_URL_AUTH + "/changePassword",
        {
          userId,
          oldPassword,
          newPassword,
          confirmNewPassword,
        }
        //getAuthHeaders()
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        // ✅ controlled reject
        return rejectWithValue(err.response.data);
      }
      // fallback
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk for changing password
// export const changePassword = createAsyncThunk(
//   "auth/changePassword", // action type prefix
//   async (
//     { userId, oldPassword, newPassword, confirmNewPassword },
//     { rejectWithValue }
//   ) => {
//     // Check if user is authenticated
//     if (isUserNotLoggedIn()) {
//       return rejectWithValue(createAuthError("notLoggedIn"));
//     }

//     if (isTokenExpiredOnly()) {
//       return rejectWithValue(createAuthError("expired"));
//     }

//     if (!checkAUTH()) {
//       return rejectWithValue(createAuthError("expired"));
//     }

//     try {
//       // Make POST request to change password endpoint
//       const response = await axios.post(
//         BASE_URL_AUTH + "/changePassword",
//         {
//           userId,
//           oldPassword,
//           newPassword,
//           confirmNewPassword,
//         },
//         getAuthHeaders()
//       );
//       return response.data; // Return response data on success
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

//verify email
export const ConfirmOTP = createAsyncThunk(
  "ConfirmOTP",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL_AUTH + "/ConfirmOTP", payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

///normal register && gmail Register (different on API path & payload)
export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        BASE_URL_AUTH + data.path,
        data.payload,
        { headers: NonAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

//normal login & gmail Login (different on API path & payload)
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        BASE_URL_AUTH + data.path,
        data.payload,
        { headers: NonAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending state for all async actions
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(ConfirmOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      });

    // Handle fulfilled state for each action
    builder
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;

        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "Registration failed";
        }
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;

        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "Login failed";
        }
      })
      .addCase(ConfirmOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;

        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "OTP verification failed";
        }
      });

    // Handle rejected state for all async actions
    builder
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(ConfirmOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      // Password change successful
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.isSuccessed;
        state.message = action.payload?.message;
        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
        } else {
          state.error = action.payload?.message || "OTP verification failed";
        }
      })
      // Password change failed
      .addCase(changePassword.rejected, (state, action) => {

        state.loading = false;
        state.success = false;
        state.error = action?.payload;
        state.message = action?.payload;
      });
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
