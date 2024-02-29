import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import {
  addPayId,
  clearWalletAmount,
  getDirectRefferedUsers,
  getMedia,
  getUserProfile,
  loginUser,
  refferalTreeCount,
  registerUser,
  registerUserByReferral,
  uploadImage,
  verifyUser,
} from "../controllers/userController.js";
import {
  resizeAndCompressImage,
  upload,
} from "../middleware/uploadMiddleware.js";

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

// Add PayId
router.route("/add-pay-id").post(protect, addPayId);

// Get direct reffered users
router.route("/get-direct-refferals").get(protect, getDirectRefferedUsers);

// Get refferal tree count
router.route("/get-refferal-tree-count").get(protect, refferalTreeCount);

// Clear the wallet
router.route("/clear-wallet").get(protect, clearWalletAmount);

export default router;
