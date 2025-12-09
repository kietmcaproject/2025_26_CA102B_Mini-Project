import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  deleteBooking,
  getFare,
  getAvailableRoutes,
} from "../controllers/booking.controller.js";
import {
  protect,
  adminOnly,
} from "../middlewares/authMiddleware.middleware.js";

const router = Router();

// Public
router.get("/flight/routes", getAvailableRoutes);
router.post("/flight/fare", getFare);

// User Routes
router.post("/flight", protect, createBooking);
router.get("/flight/my", protect, getMyBookings);
router.get("/flight/:id", protect, getBookingById);
router.delete("/flight/:id", protect, deleteBooking);

// Admin Routes
router.get("/flight/all", protect, adminOnly, getAllBookings);

export default router;
