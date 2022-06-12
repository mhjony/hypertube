import dotenv from "dotenv";
import pool from "../config/database.js";

// Helper Function to update the user data
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

// @route   POST /profile/update
// @desc    Update Profile Info
// @access  Private
const profileUpdate = async (req, res) => {
  console.log("profileUpdate end-point Hit", req.body);

  try {
    const { user_id, email, user_name, first_name, last_name } = req.body;

    // get the uploaded picture data
    let avatar = null;
    if (req.file) {
      // req.body.avatar = req.file.filename;
      avatar = req.file.filename;
    }

    // Check if user entered any info or not
    if (!email && !user_name && !first_name && !last_name) {
      return res.status(400).json("Fields can not be empty");
    }

    //1. check if user exists in the db (if not exists, then throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    //2. Check if user found
    if (!user) return res.status(404).json({ message: "User not found!" });

    //3. If user does not exist in the db, then throw error
    if (user.rows[0].length === 0) {
      return res.status(404).json({
        message:
          "This email address doesn’t match with any account! Check & Try again!",
      });
    }

    //4. Update the user table inside database with new information
    const updatedProfile = await updateAccount(user.rows[0].user_id, {
      email,
      user_name,
      first_name,
      last_name,
      avatar,
    });

    //5. New updated user info now, then return it with data !!!
    let updatedData;
    if (updatedProfile === 1) {
      updatedData = await pool.query("SELECT * FROM users WHERE user_id = $1", [
        user_id,
      ]);
    }

    res.status(200).json({ data: updatedData.rows });
  } catch (err) {
    res.status(500).send("Server Error while trying to update Profile!");
  }
};

export default {
  profileUpdate,
};
