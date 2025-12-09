import React from "react";
import { motion } from "framer-motion";
import china from "../assets/chaina.jpg";
import india from "../assets/india.jpg";
import usa from "../assets/USA.jpg";

function Blog() {
  const blogs = [
    {
      country: "India",
      image: india,
      description:
        "Indira Gandhi International Airport, New Delhi, is a world-class hub offering modern amenities, efficient services, and seamless connectivity.",
      customerTitle: "Top Customers from India",
      customerName: "Narendra Modi",
    },
    {
      country: "China",
      image: china,
      description:
        "Beijing Capital International Airport is China's busiest hub, offering top-tier services, modern facilities, and extensive global connectivity.",
      customerTitle: "Top Customers from China",
      customerName: "Xi Jinping",
    },
    {
      country: "USA",
      image: usa,
      description:
        "Los Angeles International Airport is a major U.S. gateway, providing world-class amenities, vast airline choices, and global connectivity.",
      customerTitle: "Top Customers from USA",
      customerName: "Donald Trump",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="flex flex-col w-full pb-20 md:px-32 px-8 gap-16 justify-center items-center mt-5">
      {/* 📰 Blog Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col w-full text-center items-center"
      >
        <span className="font-semibold text-blue-500 text-lg md:text-xl lg:text-2xl">
          Our Blog
        </span>
        <span className="font-bold text-slate-700 text-3xl md:text-4xl lg:text-5xl mt-2">
          Our Latest Posts
        </span>
        <p className="text-slate-500 mt-4 max-w-2xl">
          Discover unbeatable flight deals and a seamless booking experience.
          Plan your next adventure with ease today!
        </p>
      </motion.div>

      {/* 🧳 Blog Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-7xl px-4 lg:px-0 mx-auto"
      >
        {blogs.map((blog, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              y: -5,
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.img
              src={blog.image}
              alt={blog.country}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <h1 className="text-slate-700 text-xl font-bold mt-4">
              {blog.country}
            </h1>
            <p className="text-slate-500 text-center mt-2 px-4">
              {blog.description}
            </p>
            <span className="text-blue-600 text-lg font-semibold mt-4">
              {blog.customerTitle}
            </span>
            <h1 className="text-slate-800 text-md mt-2 font-semibold">
              {blog.customerName}
            </h1>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Blog;