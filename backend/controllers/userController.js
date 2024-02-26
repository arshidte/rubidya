import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

import Level from "../models/levelModel.js";
import Media from "../models/mediaModel.js";
import sharp from "sharp";

const generateRandomString = () => {
  const baseString = "RBD";
  const randomDigits = Math.floor(Math.random() * 999999);
  return baseString + randomDigits.toString();
};

function generateOTP() {
  // Generate a random number between 10000 and 99999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return randomNumber;
}

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, countryCode, email, password } = req.body;

  if (!firstName || !phone || !countryCode || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (user) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    const ownSponsorId = generateRandomString();

    if (countryCode) {
      if (countryCode == +91) {
        // Send OTP message
      } else {
        const OTP = generateOTP();
        // sendMail(email, OTP);
      }
    }

    const createUser = await User.create({
      sponsor: null,
      firstName,
      lastName,
      countryCode,
      phone,
      email,
      password,
      ownSponsorId,
      transactions: [],
    });

    if (createUser) {
      const token = jwt.sign(
        { userId: createUser._id },
        "secret_of_jwt_for_rubidya_5959",
        {
          expiresIn: "800d",
        }
      );

      res.status(201).json({
        sponsor: createUser.sponsor,
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        phone: createUser.phone,
        countryCode: createUser.countryCode,
        email: createUser.email,
        token_type: "Bearer",
        access_token: token,
        sts: "01",
        msg: "Success",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// Register User By Referral
export const registerUserByReferral = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, countryCode, email, password, userId } =
    req.body;

  if (!firstName || !phone || !countryCode || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (user) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    const ownSponsorId = generateRandomString();

    if (countryCode) {
      if (countryCode == +91) {
        // Send OTP message
      } else {
        const OTP = generateOTP();
        // sendMail(email, OTP);
      }
    }

    const createUser = await User.create({
      sponsor: userId || null,
      firstName,
      lastName,
      countryCode,
      phone,
      email,
      password,
      ownSponsorId,
      transactions: [],
    });

    if (createUser) {
      const token = jwt.sign(
        { userId: createUser._id },
        "secret_of_jwt_for_rubidya_5959",
        {
          expiresIn: "800d",
        }
      );

      res.status(201).json({
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        phone: createUser.phone,
        email: createUser.email,
        token_type: "Bearer",
        access_token: token,
        sts: "01",
        msg: "Success",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign(
      { userId: user._id },
      "secret_of_jwt_for_rubidya_5959",
      {
        expiresIn: "800d",
      }
    );

    res.status(200).json({
      _id: user._id,
      sponsor: user.sponsor,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      ownSponsorId: user.ownSponsorId,
      token_type: "Bearer",
      access_token: token,
      sts: "01",
      msg: "Success",
    });
  } else {
    res.status(401).json({ sts: "00", msg: "Login failed" });
  }
});

// Verify user (Call this after the user successfully did the payment)
const splitCommissions = async (user, amount, levels, percentages) => {
  if (!user || levels === 0) {
    return;
  }

  const commission = (percentages[0] / 100) * amount;
  const sponsor = await User.findById(user.sponsor);

  if (sponsor) {
    const walletAmount =
      Math.round((sponsor.walletAmount + commission) * 10) / 10;

    sponsor.walletAmount = walletAmount;

    sponsor.transactions.push({
      amount: commission,
      kind: "Level commission",
      fromWhom: user.name,
      level: levels,
      percentage: percentages[0],
      status: "approved",
    });

    await sponsor.save();
    splitCommissions(sponsor, amount, levels - 1, percentages.slice(1));
  } else {
    return;
  }
};

export const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error("Please send the amount");
  }

  const user = await User.findById(userId);

  if (user) {
    if (user.isVerified) {
      res.status(400);
      throw new Error("User already verified!");
    }

    user.isVerified = true;
    const level = await Level.findOne();

    const percentageArray = level.levelPercentages;
    const percentages = [];
    percentageArray.map((item) => {
      percentages.push(item.percentage);
    });

    await splitCommissions(user, amount, percentages.length, percentages);

    const updatedUser = await user.save();

    if (updatedUser) {
      res.status(200).json({ sts: "01", msg: "User verified successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "User not verified" });
    }
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Upload Image

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ sts: "00", msg: "No file uploaded" });
  }

  const { path: filePath, mimetype: fileType, filename: fileName } = req.file;

  const userId = req.user._id;

  // Resize image
  const percentage = 25;
  const metadata = await sharp(filePath).metadata();
  const newWidth = Math.round(metadata.width * (percentage / 100));
  const newHeight = Math.round(metadata.height * (percentage / 100));
  await sharp(filePath)
    .resize({ width: newWidth, height: newHeight })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile("uploads/" + fileName);
  // Resize image

  const media = await Media.create({
    userId,
    fileType,
    fileName,
    filePath,
  });

  if (media) {
    res.status(201).json({ sts: "01", msg: "Image uploaded successfully" });
  } else {
    res.status(400).json({ sts: "00", msg: "Error in uploading image" });
  }
});

// Get all the media uploaded by the user
export const getMedia = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const media = await Media.findOne({ userId });
  if (media) {
    res.status(200).json({ sts: "01", msg: "Success", media });
  } else {
    res.status(404).json({ sts: "00", msg: "No media found" });
  }
});
