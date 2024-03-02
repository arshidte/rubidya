import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Level from "../models/levelModel.js";
import Media from "../models/mediaModel.js";
import sharp from "sharp";

import { transporter } from "../config/nodeMailer.js";
import UserOTPVerification from "../models/otpModel.js";
import { Router } from "express";

const generateRandomString = () => {
  const baseString = "RBD";
  const randomDigits = Math.floor(Math.random() * 999999);
  return baseString + randomDigits.toString();
};

function generateOTP() {
  // Generate a random number between 10000 and 99999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return randomNumber;
}

// Send OTP verification email
const sendOTP = async ({ _id, email }, res) => {
  try {
    const OTP = generateOTP();

    const mailOptions = {
      from: '"Rubidya" <info@rubidya.com>',
      to: email,
      subject: "Verify Your Rubidya Account",
      html: `<p>Enter the OTP <b>${OTP}</b> in the app to verify your email</p>`,
    };

    // Hash the OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP.toString(), salt); // Convert OTP to string before hashing
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      OTP: hashedOTP,
      email: email ? email : "",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    // Save OTP record
    const newOTP = await newOTPVerification.save();

    if (newOTP) {
      await transporter.sendMail(mailOptions);

      // Check if 'res' is defined before calling 'json'
      if (res && typeof res.json === "function") {
        res.json({
          status: "PENDING",
          message: "Verification OTP email sent",
          userId: _id,
          email,
        });
      } else {
        console.error("Response object is not properly defined.");
      }
    } else {
      res.status(400);
      throw new Error("Error saving OTP record");
    }
  } catch (error) {
    console.log(error);
  }
};

// Send OTP for forget password
const sendOTPForget = async ({ email }, res) => {
  try {
    const OTP = generateOTP();

    const mailOptions = {
      from: '"Rubidya" <info@rubidya.com>',
      to: email,
      subject: "Reset Rubidya Account",
      html: `<p>Enter the OTP <b>${OTP}</b> for resetting account</p>`,
    };

    // Hash the OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(OTP.toString(), salt); // Convert OTP to string before hashing

    const newOTPVerification = new UserOTPVerification({
      OTP: hashedOTP,
      email: email ? email : "",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    // Save OTP record
    const newOTP = await newOTPVerification.save();

    if (newOTP) {
      await transporter.sendMail(mailOptions);

      // Check if 'res' is defined before calling 'json'
      if (res && typeof res.json === "function") {
        res.json({
          status: "PENDING",
          message: "OTP email sent",
          email,
        });
      } else {
        console.error("Response object is not properly defined.");
      }
    } else {
      res.status(400);
      throw new Error("Error saving OTP record");
    }
  } catch (error) {
    console.log(error);
  }
};

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

    // if (countryCode) {
    //   if (countryCode == +91) {
    //     // Send OTP message
    //   } else {
    //   }
    // }

    // await sendMail(email, OTP);

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
      referrals: [],
      payId: "",
      uniqueId: "",
    });

    if (createUser) {
      // const OTP = generateOTP();

      sendOTP({ _id: createUser._id, email: createUser.email }, res);
      // Handle account verification
      // const token = jwt.sign(
      //   { userId: createUser._id },
      //   "secret_of_jwt_for_rubidya_5959",
      //   {
      //     expiresIn: "800d",
      //   }
      // );
      // res.status(201).json({
      //   sponsor: createUser.sponsor,
      //   firstName: createUser.firstName,
      //   lastName: createUser.lastName,
      //   phone: createUser.phone,
      //   countryCode: createUser.countryCode,
      //   email: createUser.email,
      //   token_type: "Bearer",
      //   access_token: token,
      //   sts: "01",
      //   msg: "Success",
      // });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// Verify OTP Email
export const verifyOTP = asyncHandler(async (req, res) => {
  const { OTP, userId } = req.body;

  if (!userId || !OTP) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    const userOTP = await UserOTPVerification.findOne({
      userId,
    });

    if (userOTP.length <= 0) {
      throw new Error("OTP record does not exist!");
    } else {
      // Check if OTP is expired
      const { expiresAt } = userOTP;

      if (expiresAt < Date.now()) {
        await userOTP.deleteMany({ userId });
        throw new Error("OTP has expired!");
      } else {
        const validOTP = await bcrypt.compare(OTP, userOTP.OTP);

        if (!validOTP) {
          throw new Error("Invalid OTP code passed!");
        } else {
          const updatedUser = User.updateOne(
            { _id: userId },
            { $set: { isOTPVerified: true } }
          );
          if (updatedUser) {
            const deleteOTP = await UserOTPVerification.deleteMany({ userId });

            if (deleteOTP) {
              res.json({
                sts: "01",
                msg: "OTP verified successfully",
              });
            } else {
              res.status(400);
              throw new Error("Error deleting OTP record");
            }
          } else {
            res.status(400);
            throw new Error("Error updating user record");
          }
        }
      }
    }
  }
});

// Resend OTP (Use this same API for forget password)
export const resendOTP = asyncHandler(async (req, res) => {
  const { email, userId } = req.body;

  if (!userId || !email) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    const deleteExistingOTP = await UserOTPVerification.deleteMany({ userId });
    if (deleteExistingOTP) {
      sendOTP({ _id: userId, email }, res);
    } else {
      res.status(400);
      throw new Error("Error deleting existing OTP record");
    }
  }
});

// Resend OTP (Send OTP for forget)
export const sendOTPforForget = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    const deleteExistingOTP = await UserOTPVerification.deleteMany({ email });
    if (deleteExistingOTP) {
      sendOTPForget({ email }, res);
    } else {
      res.status(400);
      throw new Error("Error deleting existing OTP record");
    }
  }
});

// Verify forget password OTP
export const verifyOTPForForget = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;

  if (!email || !OTP) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    const userOTP = await UserOTPVerification.findOne({
      email,
    });

    if (userOTP.length <= 0) {
      throw new Error("OTP record does not exist!");
    } else {
      // Check if OTP is expired
      const { expiresAt } = userOTP;

      if (expiresAt < Date.now()) {
        await userOTP.deleteMany({ email });
        throw new Error("OTP has expired!");
      } else {
        const validOTP = await bcrypt.compare(OTP, userOTP.OTP);

        if (!validOTP) {
          throw new Error("Invalid OTP code passed!");
        } else {
          const deleteOTP = await UserOTPVerification.deleteMany({ email });

          if (deleteOTP) {
            res.json({
              sts: "01",
              msg: "OTP verified successfully",
            });
          } else {
            res.status(400);
            throw new Error("Error deleting OTP record");
          }
        }
      }
    }
  }
});

// Register User By Referral or direct registeration
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

    // if (countryCode) {
    //   if (countryCode == +91) {
    //     // Send OTP message
    //   } else {
    //     const OTP = generateOTP();
    //     // sendMail(email, OTP);
    //   }
    // }

    // const OTP = generateOTP();
    // const mailSent = sendMail(email, OTP);

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
      referrals: [],
      payId: "",
      uniqueId: "",
    });

    if (createUser) {
      // const OTP = generateOTP();

      // Add the new created user to the referred user's referrals
      if (userId) {
        const referredUser = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { referrals: createUser._id } },
          { new: true }
        );
      }
      sendOTP({ _id: createUser._id, email: createUser.email }, res);

      // Access token is necessory as we are using this same API
      // for both refferal as well as normal registration.
      // const token = jwt.sign(
      //   { userId: createUser._id },
      //   "secret_of_jwt_for_rubidya_5959",
      //   {
      //     expiresIn: "800d",
      //   }
      // );

      //   if (referredUser) {
      //     res.status(201).json({
      //       firstName: createUser.firstName,
      //       lastName: createUser.lastName,
      //       phone: createUser.phone,
      //       email: createUser.email,
      //       token_type: "Bearer",
      //       access_token: token,
      //       sts: "01",
      //       msg: "Success",
      //     });
      //   }
      // } else {
      //   res.status(201).json({
      //     firstName: createUser.firstName,
      //     lastName: createUser.lastName,
      //     phone: createUser.phone,
      //     email: createUser.email,
      //     token_type: "Bearer",
      //     access_token: token,
      //     sts: "01",
      //     msg: "Success",
      //   });
      // }
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

// Verify user API
export const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error("Please send the amount");
  }

  const user = await User.findById(userId);

  if (user) {
    if (user.isAccountVerified) {
      res.status(400);
      throw new Error("User already verified!");
    }

    user.isAccountVerified = true;

    // Show amount spend transaction in user's transactions
    // user.transactions.push({
    //   amount,
    //   kind: "premium",
    //   fromWhom: "self",
    //   status: "approved",
    // });

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

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  if (user) {
    res.status(200).json({ sts: "01", msg: "Success", user });
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
  const media = await Media.find({ userId });
  if (media) {
    res.status(200).json({ sts: "01", msg: "Success", media });
  } else {
    res.status(404).json({ sts: "00", msg: "No media found" });
  }
});

// Add payId and secret key
export const addPayId = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { payId, uniqueId } = req.body;

  if (!payId || !uniqueId) {
    res.status(400);
    throw new Error("Please send the payId and uniqueId");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { payId, uniqueId, isVerified: true },
    { new: true }
  );

  if (user) {
    res.status(200).json({ sts: "01", msg: "PayId added successfully" });
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Get the direct reffered users' list
export const getDirectReferredUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate({
    path: "referrals",
    select:
      "firstName lastName email phone isVerified isAccountVerified transactions",
  });

  if (user) {
    const referrals = user.referrals;

    if (referrals) {
      res.status(200).json({ sts: "01", msg: "Success", referrals });
    } else {
      res.status(404).json({ sts: "00", msg: "No referrals found" });
    }
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Get the refferal tree users count
async function getReferralTreeCount(user) {
  let count = 0;

  const referrals = await User.find({
    _id: { $in: user.referrals },
  });

  for (let referral of referrals) {
    count++;
    count += await getReferralTreeCount(referral);
  }

  return count;
}

export const refferalTreeCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user) {
    const count = await getReferralTreeCount(user);
    res.status(200).json({ sts: "01", msg: "Success", count });
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Clear the walletAmount after successfully synced with original wallet
export const clearWalletAmount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (user) {
    user.walletAmount = 0;
    const updatedUser = await user.save();
    if (updatedUser) {
      res
        .status(200)
        .json({ sts: "01", msg: "Wallet amount cleared successfully" });
    } else {
      res
        .status(400)
        .json({ sts: "00", msg: "Error in clearing wallet amount" });
    }
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please send the password");
  }

  const user = await User.findOne({ email });

  if (user) {
    user.password = password;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.status(200).json({ sts: "01", msg: "Password changed successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "Error in changing password" });
    }
  }
});
