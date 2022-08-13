import express from "express";
import profileController from "../controllers/profile.js";

import validate from "../validators/index.js";
import fileUpload from "../middleware/fileUpload.js";
// TODO: I need to fix the validations rules
import updateProfileRules from "../validators/profile/profileUpdate.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/update",
  [auth],
  // [auth, rules, validate],
  profileController.profileUpdate
);

router.post(
  "/updateProfilePicture",
  [fileUpload],
  // [auth, rules, validate, fileUpload],
  profileController.profilePictureUpdate
);

export default router;
