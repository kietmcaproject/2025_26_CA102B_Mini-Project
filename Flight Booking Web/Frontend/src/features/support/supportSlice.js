import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ----------------------------------------------------------------------
// 🔹 Async Thunks
// ----------------------------------------------------------------------

// Get OTP for a given Trip ID
export const getOtp = createAsyncThunk(
  "support/getOtp",
  async (tripId, { rejectWithValue }) => {
    try {
      // Simulated API call
      console.log("🧾 Requesting OTP for Trip ID:", tripId);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!tripId || tripId.trim().length < 5) {
        throw new Error("Invalid Trip ID.");
      }

      return { tripId, message: "OTP sent successfully!" };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send OTP.");
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "support/verifyOtp",
  async ({ tripId, otp }, { rejectWithValue }) => {
    try {
      // Simulated verification
      console.log("🔐 Verifying OTP:", otp, "for Trip ID:", tripId);
      await new Promise((resolve) => setTimeout(resolve, 800));

        if (otp !== "123456") {
          throw new Error("Invalid OTP entered.");
        }

        // Mocked trip data
        return {
          tripId,
          booking: {
            destination: "Goa",
            date: "2025-11-12",
            status: "Confirmed",
          },
        };
    } catch (err) {
      return rejectWithValue(err.message || "OTP verification failed.");
    }
  }
);

// ----------------------------------------------------------------------
// 🔹 Slice Definition
// ----------------------------------------------------------------------

const supportSlice = createSlice({
  name: "support",
  initialState: {
    tripId: "",
    otp: "",
    booking: null,
    loading: false,
    success: false,
    message: null,
    error: null,
  },
  reducers: {
    resetSupportState: (state) => {
      state.tripId = "";
      state.otp = "";
      state.booking = null;
      state.loading = false;
      state.success = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📨 Get OTP
      .addCase(getOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(getOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.tripId = action.payload.tripId;
      })
      .addCase(getOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to send OTP.";
      })

      // ✅ Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.booking = action.payload.booking;
        state.message = "OTP verified successfully!";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "OTP verification failed.";
      });
  },
});

export const { resetSupportState } = supportSlice.actions;
export default supportSlice.reducer;
