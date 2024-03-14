import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import {
  addPayId,
  changePassword,
  deductRubideum,
  getDirectReferredUsers,
  getMedia,
  getStats,
  getUserProfile,
  loginUser,
  refferalTreeCount,
  registerUser,
  registerUserByReferral,
  resendOTP,
  sendOTPforForget,
  syncWallet,
  uploadImage,
  verifyOTP,
  verifyOTPForForget,
  verifyUser,
} from "../controllers/userController.js";

import {
  resizeAndCompressImage,
  upload,
} from "../middleware/uploadMiddleware.js";

import {
  getAllPackages,
  getPackageById,
  selectPackage,
} from "../controllers/packageController.js";

router.route("/").post(protect, registerUser);
router.route("/add-user-by-refferal").post(registerUserByReferral);

// OTP Verification
router.route("/verify-otp").post(verifyOTP);

// Send forget OTP
router.route("/send-forget-otp").post(sendOTPforForget);

// Verify OTP for forget password
router.route("/forget-password-otp").post(verifyOTPForForget);

// Change password
router.route("/change-password").put(changePassword);

// Resend OTP
router.route("/resend-otp").post(resendOTP);

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
router.route("/get-direct-refferals").get(protect, getDirectReferredUsers);

// Get refferal tree count
router.route("/get-refferal-tree-count").get(protect, refferalTreeCount);

// Calculate Rubideum
router.route("/deduct-rubideum").post(protect, deductRubideum);

// Sync unrealised to rubideum wallet
router.route("/sync-wallet").get(protect, syncWallet);

// Get all packages
router.route("/get-packages").get(protect, getAllPackages);

// Get package by ID
router.route("/get-package-by-id").post(protect, getPackageById);

// Select the package
router.route("/select-package").post(protect, selectPackage);

// Get all status
router.route("/get-stats").get(protect, getStats);

export default router;
