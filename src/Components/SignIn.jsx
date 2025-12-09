import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const passwordWorker = new Worker(
  new URL("../utils/passwordWorker.js", import.meta.url)
);

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    showPassword: false,
  });

  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Worker setup
  useEffect(() => {
    passwordWorker.onmessage = (e) => {
      const { message } = e.data;
      setPasswordFeedback(message);
    };
    return () => passwordWorker.terminate();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      error: "",
    }));

    if (name === "password") {
      passwordWorker.postMessage({
        type: "validatePassword",
        payload: { password: value, minLength: 6 },
      });
    }
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    let errorMsg = "";

    if (!name.trim()) errorMsg = "Name is required.";
    else if (!email.trim()) errorMsg = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      errorMsg = "Please enter a valid email.";
    else if (!password.trim()) errorMsg = "Password is required.";

    if (errorMsg) {
      setFormData((prev) => ({ ...prev, error: errorMsg }));
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, email, password } = formData;

    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("User registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          error: "",
          showPassword: false,
        });
        setPasswordFeedback("");
        navigate("/login"); // ✅ Corrected from navigator() → navigate()
      })
      .catch((err) => {
        console.error("Registration Error:", err);
        const message =
          typeof err === "string" ? err : err?.message || "Registration failed";
        toast.error(message);
        setFormData((prev) => ({ ...prev, error: message }));
      });
  };

  const safeErrorText = (() => {
    const err = error || formData.error;
    if (!err) return "";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err?.message) return err.message;
    return String(err);
  })();

  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 min-h-screen px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6 text-blue-700">
        Sign Up
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-5"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={formData.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none pr-16"
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  showPassword: !prev.showPassword,
                }))
              }
              className="absolute inset-y-0 right-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {formData.showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {passwordFeedback && (
            <p
              className={`mt-2 text-sm ${
                passwordFeedback.includes("strong")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {passwordFeedback}
            </p>
          )}
        </div>

        {/* Error Message */}
        {safeErrorText && (
          <p className="text-center text-red-500 text-sm">{safeErrorText}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-full transition duration-200 focus:ring-2 focus:ring-blue-500 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Redirect */}
        <p className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </a>
        </p>

        {isAuthenticated && (
          <p className="text-green-600 text-sm text-center mt-2">
            Welcome, {user}!
          </p>
        )}
      </form>
    </div>
  );
}

export default SignIn;
