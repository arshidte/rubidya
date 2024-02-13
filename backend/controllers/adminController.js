import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Get all users to admin
export const getAllusers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No users found" });
  }
});
