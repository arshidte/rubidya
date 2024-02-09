import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendMail from "../config/nodeMailer.js";

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

  const user = db.users.find({
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
      firstName,
      lastName,
      countryCode,
      phone,
      email,
      password,
      ownSponsorId,
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
      "secret_of_jwt_for_sevensquare_5959",
      {
        expiresIn: "365d",
      }
    );

    res.status(200).json({
      _id: user._id,
      sponser: user.sponser,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      ownSponserId: user.ownSponserId,
      earning: user.earning,
      token_type: "Bearer",
      access_token: token,
    });
  } else {
    res.status(401).json({ sts: "00", msg: "Login failed" });
  }
});
