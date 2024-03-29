import fetch from "isomorphic-unfetch";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

const sendEmail = (email, token) => {
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
    subject: "Activate Your Hypertube Account Now",
    text: `Hello! Here is your account activation link. Please click the link to verify your account: http://localhost:8000/auth/registration-verify?token=${token}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
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

const generateToken = (user) => {
  delete user.password;

  const token = jwt.sign(user, "dfasdfhjsadhfkja34343", { expiresIn: 86400 });
  return { ...{ user }, ...{ token } };
};

const login = async (req, res) => {
  const { body } = req;
  const { provider } = body;

  if (provider === "credentials") {
    const { password, username } = body;
    try {
      //1.  Check if the username & Password is not empty
      if (!password || !username) {
        res.status(422).send({ error: "Fields can not be empty" }).end();
        return;
      }

      //2. Find the user
      const user = await findUserInfoFromDB(
        "user_name",
        username.toLowerCase()
      );

      //3. Check if user found or not
      if (!user) {
        return res
          .status(404)
          .send({
            error:
              "User Not Found. Please check your username and password and try again.",
          })
          .end();
      }

      //4. Check if the password is correct or not
      if (!bcrypt.compareSync(password, user.password))
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

  if (provider === "google") {
    try {
      const { id_token } = body;

      //1.  Check if the id_token is not empty
      if (!id_token) {
        res.status(422).send({ error: "Missing Token" }).end();
        return;
      }

      // Link: https://developers.google.com/identity/sign-in/web/backend-auth
      const googleVerificationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`;
      const googleReq = await fetch(googleVerificationUrl);
      const googleReqJson = await googleReq.json();

      const { email, given_name, family_name, picture } = googleReqJson;

      // Get the first capital letter of the first name the lowercase the family name and concat them
      const user_name = `${family_name.toLowerCase()}${given_name[0].toLowerCase()}`;

      //2. check if user exists in the db (if not exists, then throw error)
      let user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length === 0) {
        try {
          const verified = "1";
          const defaultLanguage = "en";

          const createdUser = await pool.query(
            "INSERT INTO users (first_name, last_name, user_name, email, verified, avatar, language) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
              given_name,
              family_name,
              user_name,
              email,
              verified,
              picture,
              defaultLanguage,
            ]
          );

          user = createdUser;
        } catch (error) {
          console.error(e);
          res.status(500).send({ error: "google authentication error" }).end();
        }
      }

      const userWithToken = generateToken(user.rows[0]);

      return res.status(200).send({
        ...userWithToken,
        accessToken: userWithToken.token,
        user: userWithToken.user,
        provider: "google",
      });
    } catch (e) {
      res
        .status(500)
        .send({ error: "Server Error From Google Login controller" })
        .end();
    }
  }

  // FOR 42-school provider
  if (provider === "42-school") {
    try {
      const { access_token } = body;

      if (!access_token) {
        res.status(422).send({ error: "Missing 42 access Code" }).end();
        return;
      }

      // Authorization with 42 api
      const fortyTwoUserUrl = `https://api.intra.42.fr/v2/me?access_token=${access_token}`;
      const fortyTwoUserReq = await fetch(fortyTwoUserUrl);
      const fortyTwoUserReqJson = await fortyTwoUserReq.json();

      const { first_name, last_name, login, email, image_url } =
        fortyTwoUserReqJson;

      // Check if user exists in the db (if not exists, then throw error)
      let user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      // If user does not exist, then create a new user
      if (user.rows.length === 0) {
        try {
          // Create a new user in the db if not exists
          const verified = "1";
          const defaultLanguage = "en";

          const createdUser = await pool.query(
            "INSERT INTO users (first_name, last_name, user_name, email, verified, avatar, token, language) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
              first_name,
              last_name,
              login,
              email,
              verified,
              image_url,
              access_token,
              defaultLanguage,
            ]
          );

          user = createdUser;
        } catch (error) {
          res.status(500).send({ error: "42 authentication error" }).end();
        }
      }

      const userWithToken = generateToken(user.rows[0]);

      return res.status(200).send({
        ...userWithToken,
        accessToken: userWithToken.token,
        user: userWithToken.user,
        provider: "42-school",
      });
    } catch (e) {
      res
        .status(500)
        .send({ error: "Server Error From 42-school Login controller" })
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
    const { first_name, last_name, user_name, email, password, token } =
      req.body;

    const defaultLanguage = "en";

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
      "INSERT INTO users (first_name, last_name, user_name, email, password, token, language) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        first_name,
        last_name,
        user_name,
        email,
        bcryptPassword,
        jwtToken,
        defaultLanguage,
      ]
    );
    // TODO: Need to Fix the sendEmail import issue
    sendEmail(email, jwtToken);
    res
      .status(200)
      .send({
        user: newUser.rows[0],
        accessToken: token,
        // ...userForToken,
        provider: "credentials",
        message: "User account created successfully",
      })
      .end();
    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /registrationVerify
// @desc    Email verification of user registration
// @access  Public
const registrationVerify = async (req, resp) => {
  const { token } = req.query;

  await pool.query(
    "UPDATE users SET verified = 1 WHERE token = $1",
    [token],
    (err, res) => {
      if (res && res.rowCount === 1) {
        resp.redirect("http://localhost:8000/auth/registration-verify");
      } else {
        resp.redirect("http://localhost:3000");
      }
    }
  );
};

export default {
  login,
  register,
  registrationVerify,
};
