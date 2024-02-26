import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import {
  getMedia,
  loginUser,
  registerUser,
  registerUserByReferral,
  uploadImage,
  verifyUser,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";

router.route("/").post(protect, registerUser);
router.route("/add-user-by-refferal").post(registerUserByReferral);
router.route("/login").post(loginUser);
router.route("/verify-user").post(protect, verifyUser);
// Upload image
router
.route("/upload-image")
.post(protect, upload.single("media"), uploadImage);

// Get uploaded image
router.route("/get-media").get(protect, getMedia);

export default router;
