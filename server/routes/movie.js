import express from "express";
import movieController from "../controllers/movieController.js";

const router = express.Router();

router.get("/get-movie-list", movieController.getMovieList);

export default router;
