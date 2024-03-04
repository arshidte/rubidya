import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    countryCode: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ownSponsorId: {
      type: String,
      required: true,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      // Verified if the user exist in rubideum wallet
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    walletAmount: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        amount: Number,
        kind: String,
        fromWhom: String,
        level: String,
        percentage: Number,
        status: String,
      },
    ],
    payId: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    packageSelected: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Doing encryption before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
