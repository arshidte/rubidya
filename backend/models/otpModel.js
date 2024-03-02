import mongoose from "mongoose";

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

export default UserOTPVerification;