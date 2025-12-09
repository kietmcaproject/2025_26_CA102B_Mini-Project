// src/components/Plans.jsx
import React from "react";
import plane1 from "../assets/Charter.jpg";
import plane2 from "../assets/Helicopter.webp";
import plane3 from "../assets/Private plane.jpg";
import { IoIosStar } from "react-icons/io";
import { FaPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * Local PDF path (provided in your workspace).
 * Replace with an actual public URL when deploying.
 */
const PROJECT_PDF_URL = "/mnt/data/Minor Project.pdf";

function Plans() {
  const plans = [
    {
      image: plane1,
      title: "Private Charter",
      desc: "Book a private charter for personalized, luxurious travel. Enjoy flexible schedules, ultimate privacy, and total comfort.",
      price: "Rs. 75000",
    },
    {
      image: plane2,
      title: "Helicopter Booking",
      desc: "Helicopter booking provides quick, flexible travel for short distances. Enjoy stunning views and skip the traffic.",
      price: "Rs. 87000",
    },
    {
      image: plane3,
      title: "Private Plane",
      desc: "Fly privately on your schedule with full comfort, personalized service, and complete discretion.",
      price: "Rs 83000",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-6 sm:px-10 md:px-16 overflow-hidden">
      {/* Animated background blurs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/40 rounded-full blur-3xl animate-floatSlow pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-floatReverse pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10">
        <span className="font-semibold text-blue-600 text-lg sm:text-xl md:text-2xl">
          Our Plans
        </span>
        <h1 className="font-bold text-3xl md:text-4xl text-gray-800 mt-2">
          Flights For Everyone
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
          Discover the perfect travel experience with our exclusive flight
          options tailored for everyone.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-14 w-full max-w-7xl relative z-10">
        {plans.map((plan, idx) => (
          <article
            key={idx}
            className="group relative bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            {/* Overlay (non interactive) */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              aria-hidden="true"
            ></div>

            {/* Image */}
            <div className="overflow-hidden rounded-lg">
              <img
                src={plan.image}
                alt={plan.title}
                className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content (above overlay) */}
            <div className="flex flex-col items-center text-center mt-4 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-semibold text-lg sm:text-xl text-gray-800">
                  {plan.title}
                </h1>
                <div className="flex" aria-hidden="true">
                  {[...Array(5)].map((_, index) => (
                    <IoIosStar key={index} className="text-lg text-yellow-400" />
                  ))}
                </div>
              </div>

              <h2 className="text-gray-500 text-sm mt-1">Charter B1732</h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 px-2 leading-relaxed">
                {plan.desc}
              </p>

              <h1 className="text-2xl font-bold mt-4">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                  {plan.price}
                </span>{" "}
                /Hour
              </h1>

              {/* Buttons area */}
              <div className="mt-5 flex gap-3 justify-center w-full">
                {/* Book Now */}
                <Link to="/book" className="z-20">
                  <button
                    className="bg-blue-600 text-white font-semibold rounded-full px-6 py-2 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label={`Book ${plan.title}`}
                  >
                    <FaPlane className="text-lg" />
                    Book Now
                  </button>
                </Link>

                {/* Download brochure (local file) */}
                <a
                  href={PROJECT_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="z-20"
                >
                  <button
                    className="bg-white border border-slate-200 text-slate-800 font-semibold rounded-full px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    aria-label="Download brochure"
                  >
                    Brochure
                  </button>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Plans;