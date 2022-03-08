import express from "express";
import authController from "../controllers/auth.js";

const router = express.Router();

router.post("/create-user", authController.createUser);

export default router;
