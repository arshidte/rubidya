import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import {
  getMedia,
  getUserProfile,
  loginUser,
  registerUser,
  registerUserByReferral,
  uploadImage,
  verifyUser,
} from "../controllers/userController.js";
import { resizeAndCompressImage, upload } from "../middleware/uploadMiddleware.js";

router.route("/").post(protect, registerUser);
router.route("/add-user-by-refferal").post(registerUserByReferral);

// Get user profile
router.route("/profile").get(protect, getUserProfile);

router.route("/login").post(loginUser);
router.route("/verify-user").post(protect, verifyUser);
// Upload image
router
.route("/upload-image")
.post(protect, upload.single("media"), resizeAndCompressImage, uploadImage);

// Get uploaded image
router.route("/get-media").get(protect, getMedia);

export default router;
