import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
};

const hotelBookingSlice = createSlice({
  name: "hotelBooking",
  initialState,
  reducers: {
    addHotelBooking: (state, action) => {
      state.bookings.push(action.payload);
      console.log("🏨 New Hotel Booking Added:", action.payload);
    },
    clearHotelBookings: (state) => {
      state.bookings = [];
      console.log("🧹 All hotel bookings cleared");
    },
  },
});

export const { addHotelBooking, clearHotelBookings } =
  hotelBookingSlice.actions;
export default hotelBookingSlice.reducer;
