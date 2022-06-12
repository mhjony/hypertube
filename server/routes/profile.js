import express from "express";
import profileController from "../controllers/profile.js";

import validate from "../validators/index.js";
import fileUpload from "../middleware/fileUpload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/update",
  // [auth, validate, fileUpload],
  [validate, fileUpload],
  profileController.profileUpdate
);

export default router;
