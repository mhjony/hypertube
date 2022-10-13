import express from "express";
import authController from "../controllers/auth.js";

import validate from "../validators/index.js";
import registerRules from "../validators/auth/register.js";
import loginRules from "../validators/auth/login.js";

const router = express.Router();

// Note: We have validation inside the controller for login
router.post("/login", authController.login);
router.post("/register", [registerRules, validate], authController.register);
router.get("/registration-verify", authController.registrationVerify);

export default router;
