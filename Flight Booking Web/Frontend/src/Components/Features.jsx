import React from "react";
import { motion } from "framer-motion";
import { IoBedOutline } from "react-icons/io5";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoMdGlobe } from "react-icons/io";

export default function Features() {
  const features = [
    {
      icon: <IoBedOutline className="text-5xl text-blue-600 drop-shadow-md" />,
      title: "Hotels on the House",
      desc: "Book a flight and enjoy complimentary hotel stays with our exclusive packages — luxurious comfort without extra cost.",
    },
    {
      icon: <VscWorkspaceTrusted className="text-5xl text-blue-600 drop-shadow-md" />,
      title: "Safe to Trust",
      desc: "We prioritize your security with verified bookings, encrypted transactions, and 24/7 customer assistance.",
    },
    {
      icon: <IoMdGlobe className="text-5xl text-blue-600 drop-shadow-md" />,
      title: "World Customers",
      desc: "Trusted by global travelers for seamless experiences, exclusive flight offers, and hassle-free journey planning.",
    },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center px-8 md:px-20 lg:px-32 py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, -40, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, 40, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-16"
      >
        <span className="text-blue-700 font-semibold text-lg uppercase tracking-wide">
          Our Features
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mt-3">
          Our Priceless Features
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
          We provide the best facilities for our valued customers — ensuring
          comfort, reliability, and satisfaction in every journey.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              rotate: [-0.5, 0.5, -0.5],
              transition: { duration: 0.4 },
            }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-2xl p-8 rounded-2xl flex flex-col items-center justify-between text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-500"
          >
            <div className="mb-5">{feature.icon}</div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
