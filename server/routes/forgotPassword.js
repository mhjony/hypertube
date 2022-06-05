import express from "express";
import forgotPasswordController from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/forgot-password", forgotPasswordController.forgotPassword);
router.post("/reset-password", forgotPasswordController.resetPassword);

export default router;
