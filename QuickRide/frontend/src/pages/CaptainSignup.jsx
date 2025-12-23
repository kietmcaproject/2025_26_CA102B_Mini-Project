
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { motion } from "framer-motion";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      gender: gender,
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captainData
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setGender("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          Become a Captain Today 🛞
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
          Join our fleet, drive on your schedule, and start earning instantly!
        </p>
      </motion.div>

      {/* Signup Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-3xl mx-auto hover:shadow-orange-400/10 transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-24 drop-shadow-lg"
            src="./src/assets/QuickRide_logo_1.jpeg"
            alt="Captain Logo"
          />
        </div>

        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Create Captain Account
        </h2>

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          {/* Name Fields */}
          <div className="flex flex-col sm:flex-row gap-6 mb-7">
            <input
              required
              className="bg-white/20 w-full sm:w-1/2 rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-white/20 w-full sm:w-1/2 rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <select
              required
              className="bg-white/20 mb-7 rounded-xl px-5 py-4 border border-white/20 w-full text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}   // dropdown bg
            >
              <option style={{ backgroundColor: "#1f2937" }} value="" disabled>
                Select Gender
              </option>
              <option style={{ backgroundColor: "#1f2937" }} value="male">
                Male
              </option>
              <option style={{ backgroundColor: "#1f2937" }} value="female">
                Female
              </option>
              <option style={{ backgroundColor: "#1f2937" }} value="other">
                Other
              </option>
              <option style={{ backgroundColor: "#1f2937" }} value="prefer_not_say">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Email */}
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 mb-7 rounded-xl px-5 py-3 border border-white/20 w-full text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            type="email"
            placeholder="email@example.com"
          />

          {/* Password */}
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/20 mb-7 rounded-xl px-5 py-3 border border-white/20 w-full text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            type="password"
            placeholder="password"
          />

          {/* Vehicle Info */}
          <h3 className="text-lg font-semibold text-gray-300 mb-3">
            Vehicle Information
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 mb-7">
            <input
              required
              className="bg-white/20 w-full sm:w-1/2 rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-white/20 w-full sm:w-1/2 rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            <input
              required
              className="bg-white/20 w-full sm:w-1/2 rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />

            <div className="relative w-full sm:w-1/2">
              <select
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="appearance-none bg-white/20 w-full rounded-xl px-5 py-3 border border-white/20 text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="" disabled>
                  Select Vehicle Type
                </option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>

              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-semibold text-lg shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            Create Captain Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-400 text-base">
          Already have an account?{" "}
          <Link className="text-orange-400 hover:underline" to="/captain-login">
            Login here
          </Link>
        </p>

        {/* Footer Text */}
        <p className="text-[11px] mt-6 text-gray-500 leading-tight text-center">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </motion.div>
    </div>
  );
};

export default CaptainSignup;
