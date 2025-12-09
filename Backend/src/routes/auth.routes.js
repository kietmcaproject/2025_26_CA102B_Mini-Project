import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/user.controller.js";
import {
  protect,
  adminOnly,
} from "../middlewares/authMiddleware.middleware.js";

const router = Router();

// 🧾 Public Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logout);

// 🔐 Protected Routes  
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// 🧠 Admin Routes
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/toggle-status", protect, adminOnly, toggleUserStatus);

export default router;
