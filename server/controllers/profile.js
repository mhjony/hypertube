import dotenv from "dotenv";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    });

    //5. TODO: I need to get the new updated user info now, then return it with data !!!

    res.status(200).json({ data: updatedProfile, user: user.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error while trying to update Profile!");
  }
};

/*
// https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/
const profilePictureUpload = async (req, res) => {
  console.log("profilePictureUpload end-point Hit", req.body);

  // 'profile_pic' is the name of our file input field in the HTML form
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).single("profile_pic");

  // req.file contains information of uploaded file
  // req.body contains information of text fields, if there were any
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.file) {
    return res.send("Please select an image to upload");
  } else if (err instanceof multer.MulterError) {
    return res.send(err);
  } else if (err) {
    return res.send(err);
  }

  // Display uploaded image for user validation
  res.send(
    `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
  );
};
*/

export default {
  profileUpdate,
  // profilePictureUpload,
};
