import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import { loginUser, registerUser, registerUserByReferral } from "../controllers/userController.js";

router.route("/").post(protect, registerUser);
router.route("/add-user-by-refferal").post(registerUserByReferral);
router.route("/login").post(loginUser);

export default router;