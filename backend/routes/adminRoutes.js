import express from "express";
import {
  addLevelPercentages,
  getAllusers,
  getUsersCount,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Get all users to admin
router.route("/get-all-users").get(protect, getAllusers);

// Add 10 level percentages
router.route("/add-level-percentages").post(protect, addLevelPercentages);

// Get total numbers of users to admin
router.route("/get-users-count").get(protect, getUsersCount);

export default router;
