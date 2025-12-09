import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import emailValidator from "email-validator";
import axios from "axios";
import { fetchFare, createBooking } from "../features/booking/travelBookingSlice";

function Book() {
  const dispatch = useDispatch();
  const workerRef = useRef(null);

  const { fare, loading } = useSelector((state) => state.booking);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    date: "",
    source: "",
    destination: "",
    passengers: 1,
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [workerResults, setWorkerResults] = useState({
    date: { valid: true, message: "" },
    route: { valid: true, message: "" },
    phone: { valid: true, message: "" },
  });

  const [routes, setRoutes] = useState([]); // ⬅️ dynamic route list from backend
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);

  /** 🧭 Fetch available routes from backend */
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const { data } = await axios.get("/api/bookings/flight/routes");
        if (data.success && Array.isArray(data.routes)) {
          setRoutes(data.routes);

          // Extract unique sources and destinations
          const uniqueSources = [...new Set(data.routes.map((r) => r.source))];
          const uniqueDestinations = [
            ...new Set(data.routes.map((r) => r.destination)),
          ];

          setSources(uniqueSources);
          setDestinations(uniqueDestinations);
        } else {
          toast.error("Failed to load flight routes.");
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
        toast.error("Unable to load flight routes from server.");
      }
    };
    loadRoutes();
  }, []);

  /** Initialize Web Worker for validations */
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../utils/flightValidatorWorker.js", import.meta.url),
      { type: "module" }
    );
    workerRef.current.onmessage = (e) => {
      const { data } = e;
      setWorkerResults((prev) => ({
        date: data.date || prev.date,
        route: data.route || prev.route,
        phone: data.phone || prev.phone,
      }));
    };
    return () => workerRef.current?.terminate();
  }, []);

  /** Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["phone", "aadhar", "passengers"].includes(name) && /\D/.test(value))
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (!workerRef.current) return;
    switch (name) {
      case "date":
        workerRef.current.postMessage({
          type: "validateDate",
          payload: { date: value },
        });
        break;
      case "phone":
        workerRef.current.postMessage({
          type: "validatePhone",
          payload: { phone: value },
        });
        break;
      case "source":
      case "destination": {
        const { source, destination } = { ...formData, [name]: value };
        workerRef.current.postMessage({
          type: "validateRoute",
          payload: { source, destination },
        });
        break;
      }
      default:
        break;
    }
  };

  /** Blur validation */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "aadhar" && value && !/^\d{12}$/.test(value))
      setErrors((prev) => ({ ...prev, aadhar: "Aadhar must be 12 digits." }));

    if (name === "phone" && value && !/^[6-9]\d{9}$/.test(value))
      setWorkerResults((prev) => ({
        ...prev,
        phone: { valid: false, message: "Invalid Indian phone number." },
      }));
  };

  /** 🧮 Auto-fetch fare when source/destination/passengers change */
  useEffect(() => {
    const { source, destination, passengers } = formData;
    if (source && destination && source !== destination)
      dispatch(fetchFare({ source, destination, passengers }));
    else if (source === destination && source)
      toast.error("Source and destination cannot be the same.");
  }, [formData.source, formData.destination, formData.passengers, dispatch]);

  /** Local validation */
  const validateForm = () => {
    const { name, email, aadhar, gender } = formData;
    const err = {};
    if (!name.trim()) err.name = "Full name is required.";
    if (!email.trim() || !emailValidator.validate(email))
      err.email = "Enter a valid email.";
    if (!/^\d{12}$/.test(aadhar))
      err.aadhar = "Aadhar number must be 12 digits.";
    if (!gender) err.gender = "Please select gender.";
    return err;
  };

  /** Submit Booking */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (
      !workerResults.date.valid ||
      !workerResults.route.valid ||
      !workerResults.phone.valid
    )
      return toast.error("Fix invalid fields before proceeding.");

    if (!fare)
      return toast.error("Unable to calculate fare. Please try again.");

    dispatch(createBooking(formData))
      .unwrap()
      .then(() => {
        toast.success("Booking successful!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          aadhar: "",
          date: "",
          source: "",
          destination: "",
          passengers: 1,
          gender: "",
        });
        setWorkerResults({
          date: { valid: true, message: "" },
          route: { valid: true, message: "" },
          phone: { valid: true, message: "" },
        });
      })
      .catch((err) => toast.error(err || "Booking failed."));
  };

  /** UI */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{ backgroundSize: "200% 200%", zIndex: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-10"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-8">
          ✈️ Luxury Air Booking
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Passenger Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <ValidatedField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} result={workerResults.phone} />
            <InputField label="Aadhar Number" name="aadhar" value={formData.aadhar} onChange={handleChange} onBlur={handleBlur} error={errors.aadhar} />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} error={errors.gender} />
            <InputField label="Number of Passengers" name="passengers" type="number" min="1" value={formData.passengers} onChange={handleChange} />
          </div>

          {/* Dynamic Routes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ValidatedField label="Travel Date" name="date" type="date" value={formData.date} onChange={handleChange} result={workerResults.date} />

            <SelectField
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              options={sources}
            />

            <ValidatedSelect
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              result={workerResults.route}
              options={destinations}
            />
          </div>

          {/* Fare Display */}
          {fare && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
              <p className="text-blue-800 text-lg font-medium">
                Estimated Fare for {formData.passengers} Passenger
                {formData.passengers > 1 ? "s" : ""}:{" "}
                <span className="font-bold text-blue-700">
                  ₹{fare.toLocaleString()}
                </span>
              </p>
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            disabled={
              loading ||
              !workerResults.date.valid ||
              !workerResults.route.valid ||
              !workerResults.phone.valid
            }
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ||
              !workerResults.date.valid ||
              !workerResults.route.valid ||
              !workerResults.phone.valid
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

/** Reusable Inputs */
const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input {...props} className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500" />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const SelectField = ({ label, options, error, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select {...props} className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500">
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.toLowerCase()} value={opt.toLowerCase()}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const ValidatedField = ({ label, result, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input {...props} className={`w-full border p-3 rounded-md focus:ring-2 ${result.valid ? "border-gray-300 focus:ring-blue-500" : "border-red-400 focus:ring-red-400"}`} />
    {result.message && <p className={`text-sm mt-1 ${result.valid ? "text-green-600" : "text-red-500"}`}>{result.message}</p>}
  </div>
);

const ValidatedSelect = ({ label, result, options, ...props }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select {...props} className={`w-full border p-3 rounded-md focus:ring-2 ${result.valid ? "border-gray-300 focus:ring-blue-500" : "border-red-400 focus:ring-red-400"}`}>
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.toLowerCase()} value={opt.toLowerCase()}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default Book;
