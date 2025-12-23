
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Start = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0.2 }}
          animate={{ scale: [0.8, 1.2, 0.9, 1], opacity: [0.3, 0.1, 0.3, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
        ></motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-green-400 text-transparent bg-clip-text"
        >
          Welcome to QuickRide
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 mt-3 text-lg"
        >
          Your ride, your way — fast, safe, and effortless.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-teal-500 to-green-400 hover:from-green-400 hover:to-teal-500 text-black font-semibold px-10 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 text-sm text-gray-400"
      >
        © 2025 QuickRide — Inspired by Uber
      </motion.div>
    </div>
  );
};

export default Start;
