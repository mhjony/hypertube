import express from "express";
import forgotPasswordController from "../controllers/forgotPasswordController.js";

import validate from "../validators/index.js";
import forgotPasswordRules from "../validators/resetPassword/forgotPassword.js";
import resetPasswordRules from "../validators/resetPassword/resetPassword.js";

const router = express.Router();

router.post(
  "/forgot-password",
  [forgotPasswordRules, validate],
  forgotPasswordController.forgotPassword
);

router.post(
  "/reset-password",
  [resetPasswordRules, validate],
  forgotPasswordController.resetPassword
);

export default router;
