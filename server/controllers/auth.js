// require("dotenv").config();
import pool from "../config/database.js";
// import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import validator from "validator";

// import sendEmail from "../utils/email";

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
  try {
    const { body } = req;
    const { provider, username, password } = body;
    console.log("body", body);

    if (provider === "credentials") {
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
      return res.status(200).send({
        userWithToken,
        accessToken: userWithToken.token,
        provider: "credentials",
      });
    }

    if (provider === "google") {
      // Check is the oauth2 token valid
      const { id_token, idToken } = body.account;
      console.log("dfafdfjh -----------------------------");
      let googleIdToken = idToken;

      if (!idToken) {
        googleIdToken = id_token;
      }

      const googleVerificationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`;
      // const googleReq = await fetch(googleVerificationUrl);
      // const googleReqJson = await googleReq.json();
      // const sub = `google-oauth2|${googleReqJson.sub}`;

      //2. Find the user
      // const profile = await findUserInfoFromDB(
      //   "username",
      //   username.toLowerCase()
      // );

      /*
      if (!profile) {
        // create account for google user which does not have exolyt account
        try {
          const { email } = googleReqJson;

          // Validate email
          if (validator.isEmail(email)) {
            // create new user
            const createdUser = await User.create({
              // sub,
              email,
              email_verified: true,
            });

            profile = await await findUserInfoFromDB(
              "username",
              username.toLowerCase()
            );
          } else {
            res.status(401).json({
              message:
                "Unexpected error: can't create account with that Google account",
            });
            return;
          }
        } catch (e) {
          res.status(500).send({ error: "google authentication error" }).end();
          return;
        }
      }*/

      //6. Generate auth Token
      // const userWithToken = generateToken(user);
      return res.status(200).send({
        // userWithToken,
        // accessToken: userWithToken.token,
        provider: "google",
        id_token,
        idToken,
        googleVerificationUrl,
      });
    }
  } catch (e) {
    res
      .status(500)
      .send({ error: "Server Error From Credential Login controller" })
      .end();
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
      "INSERT INTO users (first_name, last_name, user_name, email, password, token) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [first_name, last_name, user_name, email, bcryptPassword, jwtToken]
    );
    res.json(newUser.rows[0]);

    //6. Finally send the email to verify the registration
    // return res.json(sendEmail(email, jwtToken));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export default {
  login,
  register,
};
