import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addHotelBooking } from "../features/booking/hotelBookingSlice";

function Hotal() {
  const workerRef = useRef(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    destination: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [workerResults, setWorkerResults] = useState({
    phone: { valid: true, message: "" },
    date: { valid: true, message: "" },
  });

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../utils/hotelValidatorWorker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const data = e.data;
      setWorkerResults((prev) => ({
        phone: data.phone || prev.phone,
        date: data.date || prev.date,
      }));
    };

    return () => workerRef.current?.terminate();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (!workerRef.current) return;

    if (name === "phone") {
      workerRef.current.postMessage({
        type: "validatePhone",
        payload: { phone: value },
      });
    }

    if (name === "checkIn" || name === "checkOut") {
      const { checkIn, checkOut } = { ...formData, [name]: value };
      workerRef.current.postMessage({
        type: "validateStayDates",
        payload: { checkIn, checkOut },
      });
    }
  };

  // Local validation
  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Full name is required.";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      err.email = "Invalid email address.";
    if (!formData.destination.trim()) err.destination = "Select a destination.";
    if (!formData.roomType.trim()) err.roomType = "Select a room type.";
    if (!formData.checkIn.trim()) err.checkIn = "Select check-in date.";
    if (!formData.checkOut.trim()) err.checkOut = "Select check-out date.";
    if (!formData.phone.trim()) err.phone = "Enter phone number.";
    return err;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (!workerResults.phone.valid || !workerResults.date.valid) {
      toast.error("Fix invalid fields before submitting.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      dispatch(addHotelBooking(formData));
      toast.success("Booking Successful!");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        roomType: "",
        destination: "",
      });
      setWorkerResults({
        phone: { valid: true, message: "" },
        date: { valid: true, message: "" },
      });
      setLoading(false);
    }, 1000);
  };

  // UI
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌈 Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        className="absolute w-64 h-64 bg-blue-300/40 rounded-full blur-3xl top-10 left-10"
        animate={{ y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl bottom-16 right-12"
        animate={{ y: [0, 60, 0], opacity: [1, 0.6, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-6">
          🏨 Hotel Booking
        </h2>

        {submitted ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Booking Successful!
            </h3>
            <p className="text-gray-700">
              Thank you, <span className="font-bold">{formData.name}</span>!
              <br />
              Your stay at{" "}
              <span className="text-blue-700 font-medium">
                {formData.destination}
              </span>{" "}
              is confirmed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name / Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    errors.name
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:ring-2 ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : workerResults.phone.valid
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-400 focus:ring-red-400"
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              {!errors.phone && workerResults.phone.message && (
                <p
                  className={`text-sm mt-1 ${
                    workerResults.phone.valid
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {workerResults.phone.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Check-In
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    errors.checkIn
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.checkIn && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Check-Out
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 ${
                    errors.checkOut
                      ? "border-red-400 focus:ring-red-400"
                      : workerResults.date.valid
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-red-400 focus:ring-red-400"
                  }`}
                />
                {errors.checkOut && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                )}
                {!errors.checkOut && workerResults.date.message && (
                  <p
                    className={`text-sm mt-1 ${
                      workerResults.date.valid
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {workerResults.date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
              {/* Room Type */}
              <div className="flex-1">
                <label
                  htmlFor="roomType"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Room Type
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.roomType
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select a room type</option>
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="suite">Suite</option>
                </select>
                {errors.roomType && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
                )}
              </div>

              {/* Destination */}
              <div className="flex-1">
                <label
                  htmlFor="destination"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Destination
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.destination
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select Destination</option>
                  <option value="paris">Paris</option>
                  <option value="tokyo">Tokyo</option>
                  <option value="sydney">Sydney</option>
                  <option value="goa">Goa</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="switzerland">Switzerland</option>
                </select>
                {errors.destination && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              disabled={
                loading ||
                !workerResults.phone.valid ||
                !workerResults.date.valid
              }
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                loading ||
                !workerResults.phone.valid ||
                !workerResults.date.valid
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Book Now"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default Hotal;
