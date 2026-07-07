import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Admin_Url = process.env.REACT_APP_ADMIN_API_URL;

// Returns language-aware headers for public admin language endpoint.
const getNonAuthHeaders = () => {
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Loads available UI languages shown in language selection screens.
export const fetchLanguages = createAsyncThunk(
  "language/fetchLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Admin_Url}/Get_Languages`,
        {},
        getNonAuthHeaders()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to load languages"
      );
    }
  }
);

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLang: localStorage.getItem("lang") || "en",
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Updates currently selected language in Redux state.
    setLanguages: (state, action) => {
      state.currentLang = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLanguages } = languageSlice.actions;
export default languageSlice.reducer;