import express from "express";
import {
  addLevelPercentages,
  editLevelPercentages,
  getAllLevelPercentages,
  getAllusers,
  getUsersCount,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { addPackage } from "../controllers/packageController.js";
const router = express.Router();

// Get all users to admin
router.route("/get-all-users").get(protect, getAllusers);

// Add 10 level percentages
router.route("/add-level-percentages").post(protect, addLevelPercentages);

// Get percentages
router.route("/get-level-percentages").get(protect, getAllLevelPercentages);

// Edit percentage
router.route("/edit-level-percentages").put(protect, editLevelPercentages);

// Get total numbers of users to admin
router.route("/get-users-count").get(protect, getUsersCount);

// Add new package
router.route("/add-package").post(protect, addPackage);

export default router;
