// require("dotenv").config();
import dotenv from "dotenv";
import pool from "../config/database.js";
// import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

const sendEmail = (email, token) => {
  console.log(`Sending email to ${email}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: 'hive.web.branch',
      // pass: 'hive.web.branch93'
      //   type: 'OAuth2',
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
      //   clientId: appClientId,
      //   clientSecret: appClientSecret,
      //   refreshToken: appRefreshToken
    },
  });
  const mailOptions = {
    from: "hive.web.branch@gmail.com",
    to: email,
    subject: "Activate Your Hypertube Account Now",
    text: `Hello! Here is your account activation link. Please click the link to verify your account: http://localhost:8000/auth/registrationVerify?token=${token}`,
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

// Function to generate token
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
    if (user.rows.length === 0) {
      return res
        .status(404)
        .json(
          "This email address doesn’t match with any account! Check & Try again!"
        );
    }

    // Check if account activated or not
    if (user.rows.verified === 0) {
      return res
        .status(426)
        .json("Account is not activated yet, please check your email!");
    }

    // Create new token to reset password
    const jwtToken = crypto.randomBytes(42).toString("hex");

    // Update the token inside database with freshly generated token
    await updateAccount(user.user_id, { token: jwtToken });

    // Send email to reset the password
    // return res.json(resetEmail(email, token)); // Send email to reset the password
    res.status(200).json({ user: user.rows, jwtToken }); // After email is working, then remove this line
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export default {
  forgotPassword,
};
