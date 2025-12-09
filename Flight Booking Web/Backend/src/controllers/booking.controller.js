import Booking from "../models/Booking.model.js";
import connectDB from "../config/database.js";
import User from "../models/User.model.js";

connectDB();

const BASE_FARES = {
  "mumbai-goa": 3500,
  "mumbai-paris": 25000,
  "mumbai-tokyo": 32000,
  "mumbai-sydney": 29000,
  "mumbai-switzerland": 45000,
  "goa-mumbai": 3500,
  "paris-tokyo": 28000,
  "tokyo-sydney": 30000,
  "goa-switzerland": 41000,
  "paris-switzerland": 20000,
  "tokyo-paris": 28000,
  "sydney-goa": 40000,
  "switzerland-mumbai": 45000,
  "switzerland-goa": 41000,
  "switzerland-paris": 20000,
  "sydney-mumbai": 29000,
  "sydney-tokyo": 30000,
};

const calculateFare = (source, destination, passengers = 1) => {
  const key = `${source}-${destination}`.toLowerCase();
  const base = BASE_FARES[key] || Math.floor(Math.random() * 20000) + 5000;
  return base * passengers;
};

export const getAvailableRoutes = async (req, res) => {
  try {
    const routes = Object.keys(BASE_FARES).map((route) => {
      const [source, destination] = route.split("-");
      return { source, destination, baseFare: BASE_FARES[route] };
    });

    return res.status(200).json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    console.error("Fetching routes error:", error);
    res.status(500).json({ message: "Server error fetching routes." });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      aadhar,
      gender,
      source,
      destination,
      date,
      passengers,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !aadhar ||
      !gender ||
      !source ||
      !destination ||
      !date ||
      !passengers
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure source and destination are different
    if (source.toLowerCase() === destination.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    // Validate phone and Aadhar format
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid Indian phone number." });
    }

    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).json({ message: "Aadhar must be 12 digits." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🚀 Calculate secure fare
    const fare = calculateFare(source, destination, passengers);

    const booking = await Booking.create({
      name,
      email,
      phone,
      aadhar,
      gender,
      source,
      destination,
      date,
      passengers,
      fare,
    });

    user.tickets.push(booking._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return res.status(500).json({ message: "Server error creating booking." });
  }
};

export const getFare = async (req, res) => {
  try {
    const { source, destination, passengers } = req.body;
    console.log(req.body);

    if (!source || !destination) {
      return res
        .status(400)
        .json({ message: "Source and destination are required." });
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    const fare = calculateFare(source, destination, passengers || 1);

    return res.status(200).json({ success: true, fare });
  } catch (error) {
    console.error("Fare calculation error:", error);
    return res.status(500).json({ message: "Server error calculating fare." });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).sort({
      createdAt: -1,
    });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found." });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Fetching user bookings error:", err);
    res.status(500).json({ message: "Server error fetching user bookings." });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Fetching all bookings error:", err);
    res.status(500).json({ message: "Server error fetching all bookings." });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Allow admin or owner only
    if (
      req.user.role !== "admin" &&
      booking.email.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Fetching booking by ID error:", err);
    res.status(500).json({ message: "Server error fetching booking." });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      booking.email.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ message: "Server error deleting booking." });
  }
};
