import bcrypt from "bcryptjs";

const users = [
  {
    sponser: null,
    name: "user1",
    email: "user1@gmail.com",
    phone: 9876543230,
    password: bcrypt.hashSync("1234", 10),
    isAdmin: true,
    ownSponsorId: "RDB876534",
  },
];

export default users;
