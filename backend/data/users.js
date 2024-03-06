import bcrypt from "bcryptjs";

const users = [
  {
    sponsor: null,
    firstName: "firstName",
    lastName: "lastName",
    email: "email@gmail.com",
    countryCode: "+91",
    phone: 9876543230,
    password: bcrypt.hashSync("1234", 10),
    isAdmin: true,
    ownSponsorId: "RDB876534",
    isVerified: true,
    totalReferralAmount: 0,
  },
];

export default users;
