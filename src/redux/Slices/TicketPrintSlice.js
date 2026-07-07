import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// Calls backend print endpoint and returns print confirmation payload.
export const PrintTicketAPI = createAsyncThunk(
  "ticket/PrintTicket",
  async (TicketData, { rejectWithValue }) => {

    try {
      const response = await api.post(`${BOOKING_URL}/PrintTicket`, TicketData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const TicketPrintSlice = createSlice({
  name: "ticket",
  initialState: {
    loading: false,
    error: null,
    success: false,
    printed: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PrintTicketAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(PrintTicketAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.printed = action.payload === true;
      })
      .addCase(PrintTicketAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.printed = false;
      });
  },
});

export const {} = TicketPrintSlice.actions;
export default TicketPrintSlice.reducer;
