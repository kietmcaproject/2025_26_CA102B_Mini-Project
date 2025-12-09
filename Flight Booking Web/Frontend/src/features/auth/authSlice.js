// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

/**
 * Axios instance: ensure `withCredentials: true` so browser sends/accepts cookies
 * for cross-origin requests (frontend origin must be allowed on server via CORS).
 */
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

// ---------------------------
// Thunks
// ---------------------------

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/signup", { name, email, password });
      console.log("Registration Response:", data);

      // Save client-side cookies (non-httpOnly) used by UI
      // Add path "/" to ensure consistent removal later
      if (data?.token) {
        Cookies.set("auth_token", data.token, { expires: 7, path: "/" });
      }
      Cookies.set(
        "user_info",
        JSON.stringify({
          name: data?.user?.name || name,
          email: data?.user?.email || email,
        }),
        { expires: 7, path: "/" }
      );

      // Return entire response data for reducers
      return data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Registration failed";
      console.error("Registration Error:", message);
      return rejectWithValue(message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // API expects email field, so we pass email: username
      const { data } = await API.post("/login", {
        email: username,
        password,
      });
      console.log("Login Response:", data);

      // Set client cookies
      if (data?.token) {
        Cookies.set("auth_token", data.token, { expires: 7, path: "/" });
      }
      Cookies.set(
        "user_info",
        JSON.stringify({
          name: data?.user?.name || data?.name || username,
          email: data?.user?.email || data?.email || username,
        }),
        { expires: 7, path: "/" }
      );

      return data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Login failed";
      console.error("Login Error:", message);
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Call server to clear httpOnly cookie (if any)
      const { data } = await API.post("/logout");

      // Also clear client-side cookies created via js-cookie
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("user_info", { path: "/" });

      return data;
    } catch (err) {
      // Even if server fails, clear client cookies to force logout on client
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("user_info", { path: "/" });

      const message = err.response?.data?.error || err.message || "Logout failed";
      console.error("Logout Error:", message);
      return rejectWithValue(message);
    }
  }
);

// ---------------------------
// Initial state
// ---------------------------
const initialUserInfo = (() => {
  try {
    const raw = Cookies.get("user_info");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: initialUserInfo?.name || null,
  email: initialUserInfo?.email || null,
  token: Cookies.get("auth_token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!Cookies.get("auth_token"),
};

// ---------------------------
// Slice
// ---------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // if you want manual logout in reducers (not async), you can add one
    forceLogout(state) {
      state.user = null;
      state.email = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      Cookies.remove("auth_token", { path: "/" });
      Cookies.remove("user_info", { path: "/" });
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Use API shape: data.user and data.token (safe checks)
        state.user = action.payload?.user?.name || action.payload?.name || state.user;
        state.email = action.payload?.user?.email || action.payload?.email || state.email;
        state.token = action.payload?.token || state.token;
        state.isAuthenticated = !!state.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user?.name || action.payload?.name || state.user;
        state.email = action.payload?.user?.email || action.payload?.email || state.email;
        state.token = action.payload?.token || state.token;
        state.isAuthenticated = !!state.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.email = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // If logout fails on server we still clear client state
        state.user = null;
        state.email = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;