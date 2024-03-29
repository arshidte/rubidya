import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Level from "../models/levelModel.js";
import Media from "../models/mediaModel.js";

import { transporter } from "../config/nodeMailer.js";
import UserOTPVerification from "../models/otpModel.js";

import axios from "axios";
import Package from "../models/packageModel.js";
import Revenue from "../models/revenueModel.js";
import ProfilePic from "../models/profilePicModel.js";

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
const sendOTP = async ({ _id, email, countryCode, phone }, res) => {
  console.log(countryCode, phone);
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
      if (countryCode == 91) {
        // await transporter.sendMail(mailOptions);

        console.log("Sending OTP via SMS");

        const response = await axios.get(
          `https://otp2.aclgateway.com/OTP_ACL_Web/OtpRequestListener?enterpriseid=stplotp&subEnterpriseid=stplotp&pusheid=stplotp&pushepwd=stpl_01&msisdn=${phone}&sender=HYBERE&msgtext=Welcome%20to%20Rubidya!%20Your%20OTP%20for%20registration%20is%20%20${OTP}.%20Please%20enter%20this%20code%20to%20complete%20your%20registration&dpi=1101544370000033504&dtm=1107170911722074274`
        );
      } else {
        await transporter.sendMail(mailOptions);
      }

      // Check if 'res' is defined before calling 'json'
      if (res && typeof res.json === "function") {
        res.status(200).json({
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
const sendOTPForget = async ({ email, countryCode, phone }, res) => {
  try {
    const OTP = generateOTP();

    const mailOptions = {
      from: '"Rubidya" <info@rubidya.com>',
      to: email,
      subject: "Reset Rubidya Account",
      html: `<p>Enter the OTP <b>${OTP}</b> for verify/reset account</p>`,
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
      if (countryCode == 91) {
        // await transporter.sendMail(mailOptions);

        const response = await axios.get(
          `https://otp2.aclgateway.com/OTP_ACL_Web/OtpRequestListener?enterpriseid=stplotp&subEnterpriseid=stplotp&pusheid=stplotp&pushepwd=stpl_01&msisdn=${phone}&sender=HYBERE&msgtext=Hello%20from%20Rubidya.%20Your%20OTP%20for%20password%20reset%20is%20${OTP}.%20Enter%20this%20code%20to%20securely%20reset%20your%20password&dpi=1101544370000033504&dtm=1107170911810846940`
        );
        console.log(`SMS OTP response: ${response.data}`);
      } else {
        await transporter.sendMail(mailOptions);
      }

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
      sendOTP(
        {
          _id: createUser._id,
          email: createUser.email,
          countryCode: createUser.countryCode,
          phone: createUser.phone,
        },
        res
      );
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// Verify OTP Email/SMS
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
          const updatedUser = await User.updateOne(
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

// Resend OTP
export const resendOTP = asyncHandler(async (req, res) => {
  const { email, userId } = req.body;

  const user = await User.findById(userId);

  if (!userId || !email) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    const deleteExistingOTP = await UserOTPVerification.deleteMany({ userId });
    if (deleteExistingOTP) {
      sendOTP(
        {
          _id: userId,
          email,
          countryCode: user.countryCode,
          phone: user.phone,
        },
        res
      );
    } else {
      res.status(400);
      throw new Error("Error deleting existing OTP record");
    }
  }
});

// Resend OTP (Send OTP for forget)
export const sendOTPforForget = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existEmail = await User.findOne({ email });

  if (!email) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  } else {
    if (existEmail) {
      const deleteExistingOTP = await UserOTPVerification.deleteMany({ email });
      if (deleteExistingOTP) {
        sendOTPForget(
          {
            email,
            countryCode: existEmail.countryCode,
            phone: existEmail.phone,
          },
          res
        );
      } else {
        res.status(400);
        throw new Error("Error deleting existing OTP record");
      }
    } else {
      res.status(400).json({ sts: "00", msg: "Email does not exist" });
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

          const updateUser = await User.updateOne(
            { email },
            { $set: { isOTPVerified: true } }
          );

          if (deleteOTP && updateUser) {
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
    res.status(400).json({ sts: "00", msg: "User already exists" });
  } else {
    const ownSponsorId = generateRandomString();

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
      // Add the new created user to the referred user's referrals
      if (userId) {
        const referredUser = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { referrals: createUser._id } },
          { new: true }
        );
      }
      sendOTP(
        {
          _id: createUser._id,
          email: createUser.email,
          countryCode: createUser.countryCode,
          phone: createUser.phone,
        },
        res
      );
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, adminLogin } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (adminLogin) {
      if (!user.isAdmin) {
        res.status(401).json({
          sts: "00",
          msg: "You are not authorized to access this page",
        });
      }
    }

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
      acStatus: user.acStatus,
      ownSponsorId: user.ownSponsorId,
      isOTPVerified: user.isOTPVerified,
      totalReferralAmount: user.totalReferralAmount,
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
    // const walletAmount =
    //   Math.round((sponsor.walletAmount + commission) * 10) / 10;

    if (!sponsor.walletAmount) {
      sponsor.walletAmount = commission;
    } else {
      sponsor.walletAmount += commission;
    }

    sponsor.transactions.push({
      amount: commission,
      kind: "Level commission",
      fromWhom: user.name,
      level: levels,
      percentage: percentages[0],
      status: "approved",
    });

    if (!sponsor.totalReferralAmount) {
      sponsor.totalReferralAmount = commission;
    } else {
      sponsor.totalReferralAmount += commission;
    }

    if (!sponsor.overallAmount) {
      sponsor.overallAmount = commission;
    } else {
      sponsor.overallAmount += commission;
    }

    await sponsor.save();

    splitCommissions(sponsor, amount, levels - 1, percentages.slice(1));
  } else {
    return;
  }
};

// Verify user API
export const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Send the original amount or the package selected also inorder to detect the package.

  const { amount, packageId } = req.body;

  // Convert the amount type to number
  const newAmount = parseFloat(amount);

  if (!newAmount || !packageId) {
    res.status(400);
    throw new Error("Please send the newAmount and package");
  }

  // Get the package
  const selectedPackage = await Package.findById(packageId);

  const revenue = await Revenue.find({});

  let newAmountToaddToMonth = 0;
  let newAmountToaddToTotal = 0;
  if (revenue) {
    newAmountToaddToMonth = parseFloat(revenue[0].monthlyRevenue + newAmount);
    newAmountToaddToTotal = parseFloat(revenue[0].totalRevenue + newAmount);
  } else {
    newAmountToaddToMonth = newAmount;
    newAmountToaddToTotal = newAmount;
  }

  const updatedRevenue = await Revenue.findOneAndUpdate(
    {},
    {
      $set: {
        totalRevenue: newAmountToaddToTotal,
        monthlyRevenue: newAmountToaddToMonth,
      },
    },
    { new: true, upsert: true }
  );

  if (!selectedPackage) {
    res.status(400);
    throw new Error("Please select a valid package");
  }

  const user = await User.findById(userId);

  if (user) {
    user.isAccountVerified = true;
    user.packageSelected = packageId;

    const usersToUpdate = await User.find({
      packageName: { $exists: true, $type: "string" },
    });

    user.packageName.push(selectedPackage.packageSlug);

    // Push the user to the users in package
    const updateSelectedPackage = await Package.findByIdAndUpdate(packageId, {
      $push: { users: userId },
    });

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
      // Get the count of verified users
      const sponsorId = user.sponsor;

      res.status(200).json({ sts: "01", msg: "User verified successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "User not verified" });
    }
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Get user profile
const convertDate = (originalDate) => {
  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1;
  const year = originalDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate("packageSelected")
    .select("-password");
  if (user) {
    const response = {
      sts: "01",
      msg: "Success",
      user: {
        ...user._doc,
        updatedDOB: user.dateOfBirth
          ? convertDate(user.dateOfBirth)
          : convertDate(user.createdAt),
      },
    };
    res.status(200).json(response);
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Upload Image
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ sts: "00", msg: "No file uploaded" });
  }

  const { description } = req.body;

  const { path: filePath, mimetype: fileType, filename: fileName } = req.file;

  const userId = req.user._id;

  const media = await Media.create({
    userId,
    fileType,
    fileName,
    description,
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

  const existingUser = await User.findById(userId);
  if (existingUser) {
    const user = await User.findByIdAndUpdate(
      userId,
      { payId, uniqueId, isVerified: true, nodeId: existingUser.sponsor },
      { new: true }
    );
    if (user) {
      res.status(200).json({ sts: "01", msg: "PayId added successfully" });
    } else {
      res.status(404).json({ sts: "00", msg: "User not found" });
    }
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Get the direct referred users' list
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

// Get the referral tree users count
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
  } else {
    res.status(404).json({ sts: "00", msg: "User not found" });
  }
});

// Calculate Rubideum
export const deductRubideum = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { amount } = req.body;

  const user = await User.findById(userId);

  if (
    !user.payId ||
    !user.uniqueId ||
    user.payId === "" ||
    user.uniqueId === ""
  ) {
    res.status(400);
    throw new Error("Please send the payId and uniqueId");
  }

  // API to fetch the current market value of Rubideum
  const currentValueResponse = await axios.get(
    "https://pwyfklahtrh.rubideum.net/api/endPoint1/RBD_INR"
  );

  const currentValue = currentValueResponse.data.data.last_price;

  // Rubideum to pass
  const rubideumToPass = amount / currentValue;

  // API to deduct balance
  const response = await axios.post(
    "https://pwyfklahtrh.rubideum.net/basic/deductBalanceAuto",
    {
      payId: user.payId,
      uniqueId: user.uniqueId,
      amount: rubideumToPass,
      currency: "RBD",
    }
  );

  const dataFetched = response.data;

  if (dataFetched.success === 1) {
    res.status(200).json({
      sts: "01",
      msg: "Rubideum deducted successfully",
      rubideumToPass,
    });
  } else {
    res.status(400).json({
      sts: "00",
      msg: "Deducting Rubideum failed. Check your Rubideum balance",
    });
  }
});

// Sync unrealised to wallet amount
export const syncWallet = asyncHandler(async (req, res) => {
  const userid = req.user._id;

  if (userid) {
    const user = await User.findById(userid);

    if (user) {
      // API to credit balance
      const response = await axios.post(
        "https://pwyfklahtrh.rubideum.net/basic/creditBalanceAuto",
        {
          payId: user.payId,
          uniqueId: user.uniqueId,
          amount: user.walletAmount,
          currency: "RBD",
        }
      );

      const dataFetched = response.data;

      if (dataFetched.success === 1) {
        user.walletAmount = 0;
        const updatedUser = await user.save();
        if (updatedUser) {
          res.status(200).json({
            sts: "01",
            msg: "Unrealised synced successfully",
          });
        } else {
          res.status(400).json({ sts: "00", msg: "User not updated" });
        }
      } else {
        res.status(400).json({ sts: "00", msg: "Error in syncing unrealised" });
      }
    } else {
      res.status(400).json({ sts: "00", msg: "User not found" });
    }
  } else {
    res.status(400).json({ sts: "00", msg: "Please login first" });
  }
});

// Get stats of number of users in each plan and the total amount to distribute
export const getStats = asyncHandler(async (req, res) => {
  // Get the member profit and users' count of each plan from package
  const memberProfits = await Package.aggregate([
    {
      $project: {
        memberProfit: "$memberProfit",
        packageSlug: "$packageSlug",
        packageName: "$packageName",
        usersCount: { $size: "$users" },
      },
    },
    {
      $match: {
        memberProfit: { $gt: 0 },
      },
    },
  ]);

  // Get the monthly revenue from the revenue collection
  const revenue = await Revenue.findOne({});
  const monthlyRevenue = revenue.monthlyRevenue;

  if (memberProfits) {
    memberProfits.forEach((profit) => {
      profit.splitAmount = (
        monthlyRevenue *
        (profit.memberProfit / 100)
      ).toFixed(2);
    });

    res.status(200).json({
      sts: "01",
      msg: "Stats fetched successfully",
      memberProfits,
    });
  } else {
    res.status(404).json({ sts: "00", msg: "No stats found" });
  }
});

// Convert INR to rubidya
export const convertINR = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Get current rubidya market place
  const response = await axios.get(
    "https://pwyfklahtrh.rubideum.net/api/endPoint1/RBD_INR"
  );

  const currentValue = response.data.data.last_price;

  if (currentValue) {
    const convertedAmount = amount / currentValue;
    if (convertedAmount) {
      res.status(200).json({
        sts: "01",
        msg: "Converted successfully",
        convertedAmount,
      });
    } else {
      res.status(400).json({ sts: "00", msg: "Calculation failed" });
    }
  } else {
    res.status(400).json({ sts: "00", msg: "Error in converting" });
  }
});

// Edit user profile
export const editUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    bio,
    profession,
    gender,
    dateOfBirth,
    location,
    district,
  } = req.body;

  // Edit other details
  const user = await User.findById(userId);

  if (user) {
    const updateUser = await User.findByIdAndUpdate(userId, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      phone: phone || user.phone,
      countryCode: countryCode || user.countryCode,
      bio: bio || user.bio,
      profession: profession || user.profession,
      gender: gender || user.gender,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      location: location || user.location,
      district: district || user.district,
    });

    if (updateUser) {
      res.status(200).json({ sts: "01", msg: "User updated successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "User not updated" });
    }
  } else {
    res.status(400).json({ sts: "00", msg: "User not found" });
  }
});

// Upload profile picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ sts: "00", msg: "No file uploaded" });
  }

  const { path: filePath, mimetype: fileType, filename: fileName } = req.file;

  const userId = req.user._id;

  const profilePic = await ProfilePic.findOneAndUpdate(
    { userId: userId },
    { fileType: fileType, fileName: fileName, filePath: filePath },
    { upsert: true, new: true }
  );

  // Update user with profilePic id
  const updateUser = await User.findByIdAndUpdate(userId, {
    $set: { profilePic: profilePic._id },
  });

  if (profilePic && updateUser) {
    res.status(201).json({ sts: "01", msg: "Image uploaded successfully" });
  } else {
    res.status(400).json({ sts: "00", msg: "Error in uploading image" });
  }
});

// Follow a person
export const follow = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { followerId } = req.body;

  const user = await User.findById(userId);

  if (user.following.includes(followerId)) {
    res.status(400).json({ sts: "00", msg: "Already following" });
  } else {
    user.following.push(followerId);
    const updateUser = await user.save();

    const updateFollower = await User.findByIdAndUpdate(
      followerId,
      {
        $push: { followers: userId },
      },
      { new: true }
    );

    if (updateUser && updateFollower) {
      res.status(200).json({ sts: "01", msg: "Followed successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "Error in following" });
    }
  }
});

// Unfollow a person
export const unfollow = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { followerId } = req.body;

  const user = await User.findById(userId);

  if (!user.following.includes(followerId)) {
    res.status(400).json({ sts: "00", msg: "Not following" });
  } else {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: followerId },
      },
      { new: true }
    );

    // Update follower
    const updateFollower = await User.findByIdAndUpdate(
      followerId,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );

    if (updateUser && updateFollower) {
      res.status(200).json({ sts: "01", msg: "Unfollowed successfully" });
    } else {
      res.status(400).json({ sts: "00", msg: "Error in unfollowing" });
    }
  }
});
