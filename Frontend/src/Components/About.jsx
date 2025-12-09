import React from "react";
import { motion } from "framer-motion";
import image from "../assets/Aero.avif";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

function About() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, duration: 0.7 },
    },
  };

  return (
    <motion.div
      className="w-full lg:px-[150px] md:px-[100px] px-8 flex lg:flex-row flex-col items-center justify-between py-10 lg:gap-20 md:gap-16 gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ✈️ Left Image Section */}
      <motion.div
        variants={imageVariants}
        className="lg:w-[450px] lg:h-[450px] md:w-[400px] md:h-[400px] w-[270px] h-[270px] bg-no-repeat bg-cover"
      >
        <img
          src={image}
          alt="Airline service"
          className="rounded-full shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </motion.div>

      {/* 🧾 Right Content Section */}
      <motion.div
        className="flex flex-col lg:w-[48%] md:w-[50%] w-full md:px-0 px-4"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="text-xl lg:text-2xl text-blue-500 font-semibold"
        >
          ABOUT US
        </motion.h1>

        <motion.span
          variants={itemVariants}
          className="text-[24px] lg:text-[34px] font-medium text-gray-700 mt-1"
        >
          We Are Here To Bring You All The <br /> Comfort And Pleasure
        </motion.span>

        <motion.p
          variants={itemVariants}
          className="text-gray-700 max-w-[650px] leading-7 mt-5 text-base lg:text-lg"
        >
          We are a trusted flight booking platform offering affordable fares,
          seamless reservations, and personalized travel experiences to
          destinations worldwide.
        </motion.p>

        {/* ✅ Features Section */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-5 mt-5"
        >
          {[
            "Best Price Guarantee: Enjoy competitive fares with no hidden fees.",
            "24/7 Customer Support: We're here to assist you anytime, anywhere.",
            "Exclusive Deals: Unlock special offers and discounts on every booking.",
            "Easy Booking Process: Quick, seamless reservations with a user-friendly interface.",
          ].map((text, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <IoCheckmarkCircleOutline className="text-blue-400 lg:text-2xl md:text-xl text-3xl" />
              <span className="text-base lg:text-lg text-gray-700">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ✨ CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 rounded-full px-6 py-3 text-white font-semibold w-[200px] mt-12 shadow-md hover:bg-blue-700 transition-colors"
        >
          Discover More
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default About;
