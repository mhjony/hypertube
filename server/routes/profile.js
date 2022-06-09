import express from "express";
import profileController from "../controllers/profile.js";

// import fileUpload from "../middleware/fileUpload";
// import auth from "../middleware/auth";

const router = express.Router();

// This will be the final version after adding the middleware validation rules!
// This is super important!
// router.post(
//   "/update",
//   [auth, fileUpload, updateRules, validate],
//   profileUpdate
// );

router.post("/update", profileController.profileUpdate);

export default router;
