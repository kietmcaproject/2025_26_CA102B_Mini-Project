import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why is flight ticket booking the cheapest on SkyTrip?",
      answer: (
        <div>
          <p>
            SkyTrip directly searches multiple airline websites for{" "}
            <strong>the cheapest fares</strong>. Many airlines prefer selling
            their lowest fares here, and our{" "}
            <strong>exclusive partner deals</strong> make it even better.
          </p>
          <ul className="list-decimal ml-6 mt-2 space-y-1 text-gray-700">
            <li>Flat 10% Off up to ₹1000 with OneCard Credit Card.</li>
            <li>₹555 Off on bookings via MobiKwik wallet.</li>
            <li>Up to ₹5000 Off on HDFC EasyEMI payments.</li>
          </ul>
          <p className="mt-2">
            Visit{" "}
            <a
              href="#"
              className="text-blue-600 font-semibold hover:underline"
            >
              SkyTrip flight offers
            </a>{" "}
            for current deals.
          </p>
        </div>
      ),
    },
    {
      question: "How do I book cheap flight tickets?",
      answer: (
        <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
          <li>Book early for better fares.</li>
          <li>Travel mid-week or off-peak for discounts.</li>
          <li>Enable fare alerts for price drop notifications.</li>
          <li>Choose stopovers for cheaper routes.</li>
          <li>Avoid weekends — fares surge then.</li>
          <li>Try budget airlines like Indigo or Air India Express.</li>
        </ul>
      ),
    },
    {
      question: "What are the benefits of flight booking with SkyTrip?",
      answer:
        "Cheap fares, fast booking, live flight tracking, exclusive deals, date flexibility, and quick refunds make SkyTrip your best choice.",
    },
    {
      question:
        "How can I make a flexible online flight booking with changeable dates?",
      answer:
        "Choose ‘Assured Flex’ on the Review Flight page. It allows you to modify travel dates without penalty.",
    },
    {
      question: "Can I modify or cancel my flight booking?",
      answer:
        "Yes. SkyTrip offers ‘Assured’ for free cancellations and ‘Assured Flex’ for one-time rescheduling (date, airline, or route).",
    },
    {
      question: "What documents do I need for my flight?",
      answer:
        "You’ll need a valid photo ID (Aadhaar, Passport, or DL) and your e-ticket. International travel requires a valid passport and visa.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Background Decorative Lights */}
      <motion.div
        className="absolute top-10 left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, -30, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-80 h-80 bg-cyan-300 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, 40, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* FAQ Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-800 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Find quick answers to common queries about flights, fares, and
            flexible booking options on SkyTrip.
          </p>
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-gray-300">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left font-semibold text-gray-800 hover:text-blue-700 focus:outline-none transition-colors duration-200"
              >
                <span className="text-lg md:text-xl">{faq.question}</span>
                <motion.span
                  animate={{
                    rotate: activeIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-blue-500" />
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mt-3 text-gray-700 text-sm md:text-base leading-relaxed overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition duration-200"
          >
            View More FAQs
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

export default FAQ;
