import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slices/AuthSlice";
import languageReducer from "../Slices/languageSlice";
import destinationReducer from "../Slices/destinationsSlice";
import tripsReducer from "../Slices/tripsSlice";
import bookingReducer from "../Slices/bookingSlice";
import bookingSummaryReducer from "../Slices/bookingSummarySlice";
import confirmBookingReducer from "../Slices/confirmSlice";
import priceCalculationReducer from "../Slices/priceCalculationSlice";
import TicketPrintReducer from "../Slices/TicketPrintSlice";
import transferCategoriesReducer from "../Slices/transferCategoriesSlice";
import { authMiddleware } from "../../middleware/authMiddleware";

// Central Redux store: registers feature reducers and auth-aware middleware.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    destinations: destinationReducer,
    trips: tripsReducer,
    booking: bookingReducer,
    bookingSummary: bookingSummaryReducer,
    confirmBooking: confirmBookingReducer,
    priceCalculation: priceCalculationReducer,
    ticket: TicketPrintReducer,
    transferCategories: transferCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
