import asyncHandler from "../middleware/asyncHandler.js";
import Package from "../models/packageModel.js";
import User from "../models/userModel.js";

// Add new package by admin
export const addPackage = asyncHandler(async (req, res) => {
  const { packageName, amount, memberProfit } = req.body;

  const packageSlug = packageName.toLowerCase().split(" ").join("-");

  const addPackage = await Package.create({
    packageName,
    amount,
    memberProfit,
    packageSlug,
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

// Edit the package by admin
export const editPackage = asyncHandler(async (req, res) => {
  const { packageId, packageName, amount, memberProfit } = req.body;

  const selectedPackage = await Package.findById(packageId);

  if (selectedPackage) {
    selectedPackage.packageName = packageName || selectedPackage.packageName;
    selectedPackage.amount = amount || selectedPackage.amount;
    selectedPackage.memberProfit = memberProfit || selectedPackage.memberProfit;

    const updatedUpdatedPackage = await selectedPackage.save();

    if (updatedUpdatedPackage) {
      res.status(201).json({
        sts: "01",
        msg: "Package updated successfully",
      });
    } else {
      res.status(400).json({
        sts: "00",
        msg: "Package not updated",
      });
    }
  } else {
    res.status(400).json({
      sts: "00",
      msg: "Package not updated",
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

// Select a package
export const selectPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.body;
  const userId = req.user.id;

  // Get the package
  const selectedPackage = await Package.findById(packageId);

  // Update the user with the package
  const updatedUser = await User.findByIdAndUpdate(userId, {
    packageSelected: packageId,
    packageName: selectedPackage.packageName,
  });

  if (updatedUser) {
    // Push the user to the users in package
    const selectedPackage = await Package.findByIdAndUpdate(packageId, {
      $push: { users: userId },
    });

    if (selectedPackage) {
      res.status(201).json({
        sts: "01",
        msg: "User updated successfully",
      });
    } else {
      res.status(400).json({
        sts: "00",
        msg: "User not updated",
      });
    }
  } else {
    res.status(400).json({
      sts: "00",
      msg: "User not updated",
    });
  }
});

// Split profit to users of Prime and Golder membership
export const splitProfit = asyncHandler(async (req, res) => {});
