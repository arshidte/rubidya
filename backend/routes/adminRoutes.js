import express from "express";
import { getAllusers } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Get all users to admin
router.route("/get-all-users").get(protect, getAllusers);



export default router;