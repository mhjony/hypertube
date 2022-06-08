import express from "express";
import profileController from "../controllers/profile.js";

const router = express.Router();

router.post("/update", profileController.profileUpdate);

export default router;
