import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const links = [
    { name: "Terms & Conditions", to: "/terms" },
    { name: "Long Term Contracts", to: "/contracts" },
    { name: "Copyright Policy", to: "/copyright" },
    { name: "Customer Support", to: "/support" },
  ];

  const socials = [
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaTwitter />, href: "https://twitter.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com" },
  ];

  return (
    <footer className="relative overflow-hidden w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-600 border-t border-gray-200 mt-10">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, -40, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, 60, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* Footer Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 gap-6 md:gap-0"
      >
        {/* Left Section */}
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-xl font-bold text-blue-700">Luxury Airs</h1>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Luxury Airs. All rights reserved.
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {links.map((link, idx) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                to={link.to}
                className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 after:content-[''] after:absolute after:w-0 after:h-[1.5px] after:left-0 after:-bottom-[3px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex items-center gap-4">
          {socials.map((s, idx) => (
            <motion.a
              key={idx}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 bg-white/60 border border-white/50 rounded-full p-2 hover:bg-blue-600 hover:text-white shadow-md transition-all duration-300"
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Bottom Accent Line */}
      <div className="relative z-10 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 w-full mt-3"></div>
    </footer>
  );
}

export default Footer;
