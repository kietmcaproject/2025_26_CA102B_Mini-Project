import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getUserQueries,
} from "../controllers/constact.controller.js";
import {
  protect,
  adminOnly,
} from "../middlewares/authMiddleware.middleware.js";

const router = Router();

router.post("/", createContact);

router.get("/my", protect, getUserQueries);

router.get("/all", protect, adminOnly, getAllContacts);

export default router;
