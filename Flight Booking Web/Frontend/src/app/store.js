import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/booking/travelBookingSlice";
import hotelBookingReducer from "../features/booking/hotelBookingSlice";
import supportReducer from "../features/support/supportSlice";
import contactReducer from "../features/support/contactSlice";

// ----------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    hotelBooking: hotelBookingReducer,
    support: supportReducer,
    contact: contactReducer,
  },
});
