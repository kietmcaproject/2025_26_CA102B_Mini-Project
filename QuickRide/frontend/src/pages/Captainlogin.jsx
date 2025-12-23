

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { motion } from "framer-motion";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const captain = { email, password };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/login`,
      captain
    );

    if (response.status === 200) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          Drive with Confidence 🚗
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
          Join our fleet and start earning on your schedule with safe and easy rides.
        </p>
      </motion.div>

      {/* Captain Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-12 w-full max-w-2xl mx-auto hover:shadow-orange-400/10 transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-24 drop-shadow-lg"
            src="./src/assets/QuickRide_logo_1.jpeg"
            alt="Captain Logo"
          />
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Captain Login
        </h2>

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <label className="block text-base font-medium mb-2 text-gray-300">
            Email Address
          </label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            type="email"
            placeholder="email@example.com"
          />

          <label className="block text-base font-medium mb-2 text-gray-300">
            Password
          </label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-10 px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            type="password"
            placeholder="password"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-semibold text-lg shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-8 text-gray-400 text-base">
          Join a fleet?{" "}
          <Link className="text-orange-400 hover:underline" to="/captain-signup">
            Register as a Captain
          </Link>
        </p>

        {/* Switch to User Login */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 mb-4 text-base">
            Want to ride instead?
          </p>
          <Link
            to="/login"
            className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-semibold text-lg shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            Sign in as User
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Captainlogin;
