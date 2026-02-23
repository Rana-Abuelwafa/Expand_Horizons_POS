import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "./toursSlice";
import authReducer from "../Slices/AuthSlice";
import languageReducer from "../Slices/languageSlice";
import sliderReducer from "../Slices/sliderSlice";
import destinationReducer from "../Slices/destinationsSlice";
import tripsReducer from "../Slices/tripsSlice";
import reviewReducer from "../Slices/reviewSlice";
import wishListReducer from "../Slices/wishlistSlice";
import tripDetailsReducer from "../Slices/tripDetailsSlice";
import bookingReducer from "../Slices/bookingSlice";
import extrasReducer from "../Slices/extrasSlice";
import bookingSummaryReducer from "../Slices/bookingSummarySlice";
import confirmBookingReducer from "../Slices/confirmSlice";
import priceCalculationReducer from "../Slices/priceCalculationSlice";
import bookingListReducer from "../Slices/bookingListSlice";
import bookingCancelReducer from "../Slices/bookingCancelSlice";
import { authMiddleware } from "../../middleware/authMiddleware";
import profileReducer from "../Slices/profileSlice";
import contactReducer from "../Slices/contactSlice";
import NewsletterReducer from "../Slices/newsletterSlice";
export const store = configureStore({
  reducer: {
    tours: toursReducer,
    auth: authReducer,
    language: languageReducer,
    slider: sliderReducer,
    destinations: destinationReducer,
    trips: tripsReducer,
    reviews: reviewReducer,
    wishlist: wishListReducer,
    tripDetails: tripDetailsReducer,
    booking: bookingReducer,
    extras: extrasReducer,
    bookingSummary: bookingSummaryReducer,
    confirmBooking: confirmBookingReducer,
    priceCalculation: priceCalculationReducer,
    bookingList: bookingListReducer,
    bookingCancel: bookingCancelReducer,
    profile: profileReducer,
    contact: contactReducer,
    newsletter: NewsletterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
