import dotenv from "dotenv";
import pool from "../config/database.js";
// import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

const resetEmail = (email, token) => {
  console.log(`Sending email to ${email}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    to: email,
    subject: "Reset Your Hypertube Password",
    text: `Forgot Your Password? That's okay! you can reset your password by clicking following link: http://localhost:3000/auth/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const findUserInfoFromDB = async (key, value, ...args) => {
  const info = args.length == 0 ? "*" : args.join(", ");
  const res = await pool.query(`SELECT ${info} FROM users WHERE ${key} = $1`, [
    value,
  ]);
  return res.rows[0];
};

// Helper Function to update the token in the database
const updateAccount = async (user_id, data) => {
  const keys = Object.keys(data);
  const info = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => data[key]);
  const res = await pool.query(
    `UPDATE users
		SET ${info}
		WHERE user_id = $${keys.length + 1}`,
    [...values, user_id]
  );

  return res.rowCount;
};

// @route   POST /forgotPassword
// @desc    Reset the Password if the user forgot it
// @access  Public
const forgotPassword = async (req, res) => {
  console.log("forgotPassword end-point Hit", req.body);

  try {
    const { email } = req.body;

    // Check if user entered any email or not
    if (!email) {
      return res.status(400).json("Field can not be empty");
    }

    // check if user exists in the db (if not exists, then throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // If user does not exist in the db, then throw error
    if (user.rows[0].length === 0) {
      return res
        .status(404)
        .json(
          "This email address doesn’t match with any account! Check & Try again!"
        );
    }

    // Check if account activated or not
    if (user.rows[0].verified === 0) {
      return res
        .status(426)
        .json("Account is not activated yet, please check your email!");
    }

    // Create new token to reset password
    const jwtToken = crypto.randomBytes(42).toString("hex");
    console.log(jwtToken);

    // Update the token inside database with freshly generated token
    console.log(user.rows[0].user_id);
    try {
      let ret = await updateAccount(user.rows[0].user_id, { token: jwtToken });
      console.log(ret);
    } catch (e) {
      console.log(e);
    }

    // Send email to reset the password
    return res.json(resetEmail(email, jwtToken)); // Send email to reset the password
    // res.status(200).json({ user: user.rows, jwtToken }); // After email is working, then remove this line
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const resetPassword = async (req, resp) => {
  console.log("resetPassword end-point Hit");
  const { password, token } = req.body;

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update the password in the database
  await pool.query(
    "SELECT token FROM users WHERE token = $1",
    [token],
    (err, res) => {
      if (res && res.rows[0]) {
        pool.query(
          "UPDATE users SET password = $1 WHERE token = $2",
          [hashedPassword, token],
          (err, re) => {
            if (re)
              resp.status(200).send({ message: "Password has been changed" });
            else resp.status(500).send(err);
          }
        );
      } else if (res) resp.status(500).send({ error: "No token found" });
      else resp.status(500).send({ error: err.detail });
    }
  );
};

export default {
  forgotPassword,
  resetPassword,
};
