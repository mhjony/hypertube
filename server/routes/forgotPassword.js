import express from "express";
import forgotPasswordController from "../controllers/forgotPasswordController.js";

import validate from "../validators/index.js";
import forgotPasswordRules from "../validators/resetPassword/forgotPassword.js";

const router = express.Router();

router.post(
  "/forgot-password",
  [forgotPasswordRules, validate],
  forgotPasswordController.forgotPassword
);

// Already has frontend validation, so we trust this.
router.post(
  "/reset-password",
  forgotPasswordController.resetPassword
);

export default router;
