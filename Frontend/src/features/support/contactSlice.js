import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendMessage = createAsyncThunk(
  "contact/sendMessage",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("✉️ Sending message:", formData);
      const res = await axios.post(
        "http://localhost:5000/api/queries",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📩 Message sent successfully:", res.data);
      return {
        message:
          res.data?.message ||
          "Message sent successfully! We'll contact you soon.",
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while sending the message.";
      return rejectWithValue(message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🕐 Pending
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Message sending failed.";
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
