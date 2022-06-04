import express from "express";
import authController from "../controllers/auth.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/registration-verify", authController.registrationVerify);

export default router;
