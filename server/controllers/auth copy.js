import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import sendEmail from "../utils/email";

const findUserInfo = async (key, value, ...args) => {
  const info = args.length == 0 ? "*" : args.join(", ");
  const res = await pool.query(`SELECT ${info} FROM users WHERE ${key} = $1`, [
    value,
  ]);
  return res.rows[0];
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
      // const user = await findUserInfo("user_name", username.toLowerCase());

      //3. Check if user found or not
      // if (!user) {
      //   res.status(401).send({ error: "User not found" }).end();
      //   return;
      // }
      res.status(200).send({ data: body });
    }

    //   if (provider === "credentials") {
    //     const { password, username } = body;

    //     //1. Check if password matches and fields are not empty
    //     if (!password || !username) {
    //       res.status(422).send({ error: "Fields can not be empty" }).end();
    //       return;
    //     }

    //     //2. Find the user
    //     const profile = await findUserInfo("user_name", username.toLowerCase());

    //     //3. Check if user found or not
    //     if (!profile) {
    //       res.status(401).send({ error: "User not found" }).end();
    //       return;
    //     }

    //     // Check if the password is correct or not
    //     const isPasswordCorrect = await bcrypt.compare(
    //       password,
    //       profile.password
    //     );

    //     if (!isPasswordCorrect) {
    //       res.status(401).send({ error: "Incorrect password!" }).end();
    //       return;
    //     }

    //     // Check if user is verified or not
    //     if (profile.verified === 0) {
    //       return res.status(426).json({
    //         message:
    //           "Your account is not activated yet. Please, verify your account first!",
    //       });
    //     }

    //     // Generate auth Token
    //     const { email } = profile;
    //     const userForToken = {
    //       email,
    //     };

    //     const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
    //       expiresIn: "30 days",
    //     });
    //     res
    //       .status(200)
    //       .send({ accessToken: token, ...userForToken, provider: "credentials" })
    //       .end();
    //     return;
    //   }
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
