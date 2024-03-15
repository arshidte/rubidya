import asyncHandler from "../middleware/asyncHandler.js";
import Level from "../models/levelModel.js";
import Package from "../models/packageModel.js";
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

// Add 10 level percentages
export const addLevelPercentages = asyncHandler(async (req, res) => {
  const { levelPercentages } = req.body;

  let level = await Level.findOne();

  if (!level) {
    level = new Level({ levelPercentages });
  } else {
    level.levelPercentages = levelPercentages;
  }

  const updateLevel = await level.save();

  if (updateLevel) {
    res.status(201).json({
      message: "Level percentages added successfully",
    });
  } else {
    res.status(400).json({
      message: "Level percentages not added",
    });
  }
});

// Get all level percentages
export const getAllLevelPercentages = asyncHandler(async (req, res) => {
  const level = await Level.findOne();
  if (level) {
    res.status(200).json(level.levelPercentages);
  } else {
    res.status(404).json({ message: "No level percentages found" });
  }
});

// Edit the percentage of each level
export const editLevelPercentages = asyncHandler(async (req, res) => {
  const { level, percentage } = req.body;

  const updatedLevel = await Level.findOneAndUpdate(
    { "levelPercentages.level": level },
    { $set: { "levelPercentages.$.percentage": percentage } },
    { new: true }
  );

  if (updatedLevel) {
    res.status(201).json({
      message: "Level percentages updated successfully",
    });
  } else {
    res.status(400).json({
      message: "Level percentages not updated",
    });
  }
});

// Get total numbers of users to admin
export const getUsersCount = asyncHandler(async (req, res) => {
  // const usersCount = await User.countDocuments({});
  const usersCount = await User.aggregate([
    {
      $group: {
        _id: "$isVerified",
        count: { $sum: 1 },
      },
    },
  ]);

  if (usersCount) {
    let isVerifiedCount = 0;
    let notVerifiedCount = 0;
    let totalCount = 0;

    usersCount.forEach((item) => {
      if (item._id == true) {
        isVerifiedCount = item.count;
      } else {
        notVerifiedCount = item.count;
      }
    });
    totalCount = isVerifiedCount + notVerifiedCount;
    res.status(200).json({ isVerifiedCount, notVerifiedCount, totalCount });
  } else {
    res.status(404).json({ sts: "00", msg: "No users found" });
  }
});

// Split profit to users in prime and gold membership
export const splitProfit = asyncHandler(async (req, res) => {
  const primePercent = await Package.findOne({
    packageSlug: "prime-membership",
  }).select("memberProfit");

  const goldPercent = await Package.findOne({
    packageSlug: "gold-membership",
  }).select("memberProfit");

  // Give commission to prime users
  const primeUsers = await User.find({ packageName: "prime-membership" });

  if (primeUsers.length > 0) {

    const profitPerPerson = (primeUsers.length * (primePercent / 100)).toFixed(
      2
    );

    if (profitPerPerson > 0) {

      primeUsers.forEach(async (user) => {
        user.walletAmount += profitPerPerson;
        user.totalMemberProfit += profitPerPerson;
        user.transactions.push({
          type: "monthly-profit",
          amount: profitPerPerson,
          description: "Monthly profit for prime membership",
        });
        await user.save();
      });

    }
  }

  // Give commission to gold users
  const goldUsers = await User.find({ packageName: "gold-membership" });

  if (goldUsers.length > 0) {
    const profitPerPerson = (goldUsers.length * (goldPercent / 100)).toFixed(2);
  }
  
});
