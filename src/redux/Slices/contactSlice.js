import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const CONTACT_URL = process.env.REACT_APP_CONTACT_API_URL;

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

// const getNoTokenAuthHeaders = () => {
//   let lang = localStorage.getItem("lang") || "en";
//   return {
//     headers: {
//       "Content-Type": "application/json",
//       "Accept-Language": lang,
//     },
//   };
// };

// Async thunk for submitting contact form
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (contactData, { rejectWithValue }) => {
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
        `${CONTACT_URL}/SendContactMail`,
        contactData
        //getAuthHeaders() // Using authenticated headers
      );

      return response.data;
    } catch (error) {
      // if (error.response?.status === 401) {
      //   return rejectWithValue(createAuthError("expired"));
      // }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
    submitted: false,
  },
  reducers: {
    resetContactForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.submitted = false;
    },
    clearContactError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit contact form
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.submitted = false;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submitted = true;
        state.error = null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.submitted = true;
        state.error = action.payload;
      });
  },
});

export const { resetContactForm, clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
