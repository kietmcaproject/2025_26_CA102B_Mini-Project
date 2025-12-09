import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ Set base URL for all booking-related API calls
const api = axios.create({
  baseURL: "http://localhost:5000/api/bookings/flight",
});

export const fetchFare = createAsyncThunk(
  "booking/fetchFare",
  async ({ source, destination, passengers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/fare", {
        source,
        destination,
        passengers,
      });
      return data.fare;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch fare from server";
      return rejectWithValue(message);
    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.booking;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create booking";
      return rejectWithValue(message);
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.bookings;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user bookings";
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    fare: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      toast.success("All bookings cleared");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFare.fulfilled, (state, action) => {
        state.loading = false;
        state.fare = action.payload;
      })
      .addCase(fetchFare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        toast.success("Booking created successfully!");
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
