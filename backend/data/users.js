import bcrypt from "bcryptjs";

const users = [
  {
    sponsor: null,
    firstName: "firstName",
    lastName: "lastName",
    email: "admin@rubidya.com",
    countryCode: "+91",
    phone: 9876543210,
    password: bcrypt.hashSync("pass123", 10),
    isAdmin: true,
    ownSponsorId: "RDB876534",
    isVerified: false,
    totalReferralAmount: 0,
  },
];

export default users;
