import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtp,
  verifyOtp,
  resetSupportState,
} from "../features/support/supportSlice";
import toast from "react-hot-toast";
import image from "../assets/Support.jpg";
import { Link } from "react-router-dom";

const Support = () => {
  const dispatch = useDispatch();
  const { loading, error, message, booking } = useSelector(
    (state) => state.support
  );

  const [tripId, setTripId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // --- Handle OTP Request ---
  const handleGetOtp = (e) => {
    e.preventDefault();
    if (!tripId.trim()) {
      toast.error("Please enter a valid Trip ID.");
      return;
    }

    dispatch(getOtp(tripId))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setOtpSent(true);
      })
      .catch((err) => {
        toast.error(
          typeof err === "string" ? err : err?.message || "OTP request failed"
        );
      });
  };

  // --- Handle OTP Verification ---
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    dispatch(verifyOtp({ tripId, otp }))
      .unwrap()
      .then(() => toast.success("OTP Verified! Booking found."))
      .catch((err) => {
        toast.error(
          typeof err === "string" ? err : err?.message || "Verification failed"
        );
      });
  };

  // --- Reset Form ---
  const handleReset = () => {
    dispatch(resetSupportState());
    setTripId("");
    setOtp("");
    setOtpSent(false);
  };

  const safeError =
    typeof error === "string"
      ? error
      : error?.message || (error ? String(error) : "");

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen p-6 sm:p-10 overflow-hidden">
      {/* 🌈 Floating Background Blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl animate-floatSlow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-floatReverse"></div>

      {/* 🛫 Header Section */}
      <div className="relative text-center mb-12 z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 animate-fadeDown">
          Welcome to <span className="text-blue-600">SkyTrip</span>
        </h1>
        <p className="text-gray-600 text-lg animate-fadeUp">
          Find answers to all your queries or call us at{" "}
          <span className="font-semibold text-blue-700">+91 9305981011</span>
        </p>
        <div className="flex justify-center mt-6 space-x-6 text-3xl text-gray-500">
          {["✈️", "🏨", "🚌", "🚆"].map((icon, i) => (
            <span
              key={i}
              className="hover:text-blue-500 transition-transform transform hover:scale-125 duration-300"
            >
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* 💼 Main Section */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 z-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Booking Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Want to know about your bookings? Let’s find your trips
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Enter your Trip ID below to check your booking details instantly.
            </p>

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleGetOtp}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="tripId"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Trip ID
                </label>
                <input
                  type="text"
                  id="tripId"
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  placeholder="Enter Trip ID"
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm px-4 py-3 transition duration-200"
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    6-digit OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP received"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm px-4 py-3 transition duration-200"
                  />
                </div>
              )}

              {safeError && (
                <p className="text-red-500 text-sm text-center">{safeError}</p>
              )}
              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 text-white font-bold rounded-lg shadow-md transition-all duration-200 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                }`}
              >
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Get OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2 text-blue-600 font-medium hover:underline text-sm mt-2"
                >
                  Reset
                </button>
              )}
            </form>

            {booking && (
              <div className="mt-6 text-center bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-green-700 mb-2">
                  Booking Details
                </h4>
                <p className="text-gray-700 text-sm">
                  <strong>Destination:</strong> {booking.destination}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Date:</strong> {booking.date}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Status:</strong>{" "}
                  <span className="font-medium text-green-700">
                    {booking.status}
                  </span>
                </p>
              </div>
            )}

            <p className="mt-5 text-gray-600 text-sm text-center">
              Have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 font-medium hover:underline"
              >
                Sign in
              </Link>{" "}
              to fetch your trips automatically.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn delay-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-5 text-sm">
              {[
                "How do I cancel a flight?",
                "How do I make changes to a flight reservation?",
                "Click here for Hotel FAQs",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn delay-300">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Fetch your trips to:
            </h3>
            <ul className="text-sm text-gray-600 space-y-3">
              {[
                "✅ Check your trip details",
                "✅ Cancel your trip",
                "✅ Amend your flights",
                "✅ Print E-ticket",
                "✅ and more...",
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn delay-400">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Plan your vacation and book hotels
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Book hotels in over 15,000 locations worldwide with SkyTrip.
            </p>
            <div className="overflow-hidden rounded-lg">
              <img
                src={image}
                alt="Support illustration"
                className="rounded-lg shadow-md w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
