import express from "express";
import forgotPasswordController from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/forgot-password", forgotPasswordController.forgotPassword);

export default router;
