import React from "react";
import { motion } from "framer-motion";
import image from "../assets/sky.jpg";

function Banner() {
  return (
    <section className="relative w-full md:h-[400px] h-[460px] my-16 overflow-hidden rounded-none">
      {/* 🌅 Background Image */}
      <motion.img
        src={image}
        alt="Sky"
        className="absolute w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* 🕶️ Overlay */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.8 }}
      ></motion.div>

      {/* 🌤️ Content */}
      <motion.div
        className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center p-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Heading */}
        <motion.h1
          className="text-white font-semibold text-2xl md:text-[55px] lg:text-[60px] xl:text-[70px] leading-tight drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          It's Time To Enjoy Your Freedom!
        </motion.h1>

        {/* Email Subscription */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:mt-36 mt-10 w-full max-w-[700px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.input
            type="email"
            placeholder="Email Address"
            whileFocus={{ scale: 1.02, borderColor: "#2563EB", boxShadow: "0 0 0 3px rgba(37,99,235,0.3)" }}
            transition={{ duration: 0.3 }}
            className="md:w-[500px] w-full border border-gray-400 outline-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white/80 text-gray-900 placeholder-gray-500"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-3 px-6 font-semibold shadow-md transition duration-300 hover:from-blue-500 hover:to-blue-400 focus:outline-none"
          >
            Join Our Newsletter
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Banner;
