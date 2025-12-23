

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { motion } from "framer-motion";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
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
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
          Ride Smart. Ride Quick.
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
          Experience seamless rides at your fingertips — whether you’re riding or driving.
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-12 w-full max-w-2xl mx-auto hover:shadow-green-400/10 transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-24 drop-shadow-lg"
            src="./src/assets/QuickRide_logo_1.jpeg"
            alt="QuickRide Logo"
          />
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>

        {/* Login Form */}
        <form onSubmit={submitHandler}>
          <label className="block text-base font-medium mb-2 text-gray-300">
            Email Address
          </label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            type="email"
            placeholder="you@example.com"
          />

          <label className="block text-base font-medium mb-2 text-gray-300">
            Password
          </label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-10 px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            type="password"
            placeholder="••••••••"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 text-black font-semibold text-lg shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Signup */}
        <p className="text-center mt-8 text-gray-400 text-base">
          New here?{" "}
          <Link className="text-green-400 hover:underline" to="/signup">
            Create an account
          </Link>
        </p>

        {/* Captain Join */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 mb-4 text-base">
            Want to drive with us?
          </p>
          <Link
            className="w-full p-4 py-4 rounded-xl bg-gradient-to-r from-green-400 to-teal-500 text-black font-semibold text-lg shadow-md hover:scale-[1.03] transition-all duration-300"
            to="/captain-login"
          >
            Join as Captain
          </Link>
        </div>
      </motion.div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-5xl">
        {[
        {
        title: "Affordable Rides",
       desc: "Save more with our budget-friendly pricing.",
          emoji: "💸",
         },
        {
        title: "Fast & Reliable",
            desc: "Get matched with nearby drivers in seconds.",
             emoji: "⚡",
           },
           {
             title: "Drive & Earn",
             desc: "Become a captain and earn on your schedule.",
             emoji: "🚗",
           },
         ].map((card, index) => (
           <motion.div
             key={index}
             whileHover={{ y: -8, scale: 1.03 }}
             transition={{ duration: 0.3 }}
             className="bg-white/10 border border-white/10 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md hover:bg-white/20 transition"
           >
             <div className="text-4xl mb-4">{card.emoji}</div>
             <h3 className="text-xl font-semibold text-white mb-2">
               {card.title}
             </h3>
             <p className="text-gray-300 text-sm">{card.desc}</p>
           </motion.div>
         ))}
       </div>

    </div>
  );
};

export default UserLogin;

