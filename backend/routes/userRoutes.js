import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import {
  loginUser,
  registerUser,
  registerUserByReferral,
  verifyUser,
} from "../controllers/userController.js";

router.route("/").post(protect, registerUser);
router.route("/add-user-by-refferal").post(registerUserByReferral);
router.route("/login").post(loginUser);
router.route("/verify-user").post(protect, verifyUser);

export default router;
