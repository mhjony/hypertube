import jwt from "jsonwebtoken";
require("dotenv").config();

export const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };

  const token = jwt.sign(payload, process.env.APP_KEY, {
    expiresIn: 600 * 600,
  });

  return { ...{ user }, ...{ token } };
};
