import pool from "../config/database.js";
// import sendEmail from "../utils/email";

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
  register,
};
