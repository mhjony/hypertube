import jwt from "jsonwebtoken";
require("dotenv").config();

// Function to generate token
export const generateToken = (user) => {
  delete user.password;
  // payload is user in this case
  const token = jwt.sign(user, process.env.APP_KEY, { expiresIn: 86400 });
  return { ...{ user }, ...{ token } };
};
