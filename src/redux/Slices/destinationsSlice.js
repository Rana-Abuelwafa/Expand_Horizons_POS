// features/destinations/destinationsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import api from "../../api/axios";
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

export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async (lang_code, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        BASE_URL + "/getDestinations",
        {
          lang_code: lang_code,
          currency_code: "EUR",
          country_code: "",
          leaf: true,
          trip_type: 0,
        },
        getNonAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDestinationTree = createAsyncThunk(
  "destinations/fetchDestinationTree",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        BASE_URL + "/GetDestination_Tree",
        {
          lang_code: params.lang_code,
          currency_code: "EUR",
          country_code: "",
          trip_type: params.trip_type,
        },
        getNonAuthHeaders()
      );
      return {
        data: response.data,
        trip_type: params.trip_type,
      };
    } catch (error) {
      return rejectWithValue({
        error: error.response.data,
        trip_type: params.trip_type,
      });
    }
  }
);

const destinationsSlice = createSlice({
  name: "destinations",
  initialState: {
    items: [],
    treeItems: {
      1: [], // Excursions
      2: [], // Transfers
      3: [], // Diving
    },
    loading: false,
    treeLoading: {
      1: false, // Excursions
      2: false, // Transfers
      3: false, // Diving
    },
    error: null,
    treeError: {
      1: null, // Excursions
      2: null, // Transfers
      3: null, // Diving
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDestinationTree.pending, (state, action) => {
        const tripType = action.meta.arg.trip_type;
        state.treeLoading[tripType] = true;
        state.treeError[tripType] = null;
      })
      .addCase(fetchDestinationTree.fulfilled, (state, action) => {
        const tripType = action.payload?.trip_type;
        state.treeLoading[tripType] = false;
        state.treeItems[tripType] = action.payload?.data;
      })
      .addCase(fetchDestinationTree.rejected, (state, action) => {
        const tripType = action.payload?.trip_type;
        state.treeLoading[tripType] = false;
        state.treeError[tripType] = action.payload?.error;
      });
  },
});

export default destinationsSlice.reducer;
