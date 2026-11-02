import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
// const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;
const BOOKING_URL = "http://localhost:5005/api/POS";

// Calls backend print endpoint and returns print confirmation payload.
export const PaymentAPI = createAsyncThunk(
  "payment/PaymentTicket",
  async (PaymentData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BOOKING_URL}/payment`, PaymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const PaymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    success: false,
    payed: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PaymentAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(PaymentAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.payed = action.payload === true;
      })
      .addCase(PaymentAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.payed = false;
      });
  },
});

export const {} = PaymentSlice.actions;
export default PaymentSlice.reducer;
