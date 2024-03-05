import asyncHandler from "../middleware/asyncHandler.js";
import Package from "../models/packageModel.js";

// Add new package by admin
export const addPackage = asyncHandler(async (req, res) => {
  const { packageName, amount } = req.body;
  const addPackage = await Package.create({
    packageName,
    amount,
  });
  if (addPackage) {
    res.status(201).json({
      message: "Package added successfully",
    });
  } else {
    res.status(400).json({
      message: "Package not added",
    });
  }
});

// Get all packages
export const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find();

  if (packages) {
    res.status(200).json({ sts: "01", msg: "Success", packages });
  } else {
    res.status(404).json({ sts: "00", msg: "No packages found" });
  }

});
