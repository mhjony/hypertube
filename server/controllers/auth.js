// require("dotenv").config();
import dotenv from "dotenv";
import pool from "../config/database.js";
// import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

// import sendEmail from "../utils/email";
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
const generateToken = (user) => {
  console.log("Generating token.");
  delete user.password;
  // payload is user in this case
  const token = jwt.sign(user, "dfasdfhjsadhfkja34343", { expiresIn: 86400 });
  console.log(token);
  return { ...{ user }, ...{ token } };
};

const login = async (req, res) => {
  const { body } = req;
  const { provider } = body;

  if (provider === "credentials") {
    const { password, username } = body;
    try {
      // const { provider, username, password } = body;
      // console.log("body", body);

      //1.  Check if the username & Password is not empty
      if (!password || !username) {
        res.status(422).send({ error: "Fields can not be empty" }).end();
        return;
      }

      //2. Find the user
      const user = await findUserInfoFromDB("username", username.toLowerCase());

      //3. Check if user found or not
      if (!user) {
        res.status(401).send({ error: "User not found" }).end();
        return;
      }

      // Check if the password is correct or not
      //4. if (!bcrypt.compareSync(password, user.password)) // FIXME: Need to fix bcyrpt
      if (bcrypt.compareSync(password, user.password))
        return res
          .status(401)
          .json({ message: "Incorrect password, please try again!" });

      //5. Check if user is verified or not
      if (user.verified === 0) {
        return res.status(426).json({
          message:
            "Your account is not activated yet. Please, verify your account first!",
        });
      }

      //6. Generate auth Token
      const userWithToken = generateToken(user);

      return res
        .status(200)
        .send({
          ...userWithToken,
          accessToken: userWithToken.token,
          user: userWithToken.user,
          provider: "credentials",
        })
        .end();
    } catch (e) {
      res
        .status(500)
        .send({ error: "Server Error From Credential Login controller" })
        .end();
    }
  }

  res.status(401).send({ error: "Server Error from Login controller" }).end();
};

// @route   POST /register
// @desc    Create new user
// @access  Public
const register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, token } =
      req.body;

    //2. check if user exists in the db (if not exists, then throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // if user exists, then throw error
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exits");
    }

    //3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. generating RANDOM token for validation with crypto or jwt
    const jwtToken = crypto.randomBytes(42).toString("hex");

    //5. create & enter the new user info with generated token inside my database
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, username, email, password, token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, username, email, bcryptPassword, jwtToken]
    );

    res
      .status(200)
      .send({
        user: newUser.rows[0],
        accessToken: token,
        ...userForToken,
        provider: "credentials",
      })
      .end();
    return;
    // res.json(newUser.rows[0]);

    // TODO: Need to Fix the sendEmail import issue
    // If that's not working i will move the sendEmail method in this file
    //6. Finally send the email to verify the registration
    // return res.json(sendEmail(email, jwtToken));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/*
// @route   GET /registrationVerify
// @desc    Email verification of user registration
// @access  Public
exports.registrationVerify =
  ('/registrationVerify',
  (req, resp) => {
    pool.query('UPDATE users SET verified = 1 WHERE token = $1', [req.query.token], (err, res) => {
      if (res && res.rowCount === 1) {
        resp.redirect('http://localhost:5000/registrationVerify')
      } else {
        resp.redirect('http://localhost:3000')
      }
    })
  })
  */

export default {
  login,
  register,
};
