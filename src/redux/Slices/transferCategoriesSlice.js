import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

const getNonAuthHeaders = () => {
  const lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

export const fetchTransferCategories = createAsyncThunk(
  "transferCategories/fetchTransferCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTransferCategoryAll`,
        {},
        getNonAuthHeaders(),
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch categories",
      );
    }
  },
);

const transferCategoriesSlice = createSlice({
  name: "transferCategories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTransferCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transferCategoriesSlice.reducer;