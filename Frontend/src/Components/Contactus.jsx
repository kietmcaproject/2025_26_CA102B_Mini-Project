import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  resetContactState,
} from "../features/support/contactSlice";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.contact
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Auto-fill from Cookie (but editable)
  useEffect(() => {
    try {
      const cookieData = Cookies.get("user_info");
      if (cookieData) {
        const user = JSON.parse(cookieData);
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
        }));
      }
    } catch {
      console.warn("⚠️ Invalid or missing user_info cookie");
    }
  }, []);

  // ✅ Success/Error feedback
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      setFormData((prev) => ({ ...prev, message: "" }));
      setTimeout(() => dispatch(resetContactState()), 1500);
    } else if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong."
      );
    }

    return () => dispatch(resetContactState());
  }, [success, error, message, dispatch]);

  // 🔍 Validation
  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Please enter your name.";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      err.email = "Please enter a valid email.";
    if (!formData.message.trim()) err.message = "Please enter a message.";
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(sendMessage(formData));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white overflow-hidden px-6">
      {/* 🌈 Animated Background */}
      <motion.div
        className="absolute w-72 h-72 bg-blue-200 rounded-full blur-3xl top-10 left-10 opacity-40"
        animate={{ y: [0, -40, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-cyan-300 rounded-full blur-3xl bottom-20 right-10 opacity-40"
        animate={{ y: [0, 60, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 💬 Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Have a question or feedback? We’d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "email", "message"].map((field) => (
            <div key={field} className="flex flex-col">
              <label
                htmlFor={field}
                className="text-gray-700 font-medium mb-2 capitalize"
              >
                {field}
              </label>

              {field === "message" ? (
                <motion.textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  placeholder={`Enter your ${field}`}
                  className={`bg-white/80 border rounded-xl px-4 py-3 h-28 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              ) : (
                <motion.input
                  id={field}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  placeholder={`Enter your ${field}`}
                  className={`bg-white/80 border rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              )}

              {errors[field] && (
                <span className="text-red-500 text-xs mt-1">
                  {errors[field]}
                </span>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>

          {/* Feedback */}
          {success && message && (
            <p className="text-green-600 text-center text-sm mt-2">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-center text-sm mt-2">
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong."}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
};

export default ContactUs;
