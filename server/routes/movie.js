import express from "express";
import movieController from "../controllers/movieController.js";

const router = express.Router();

router.get("/get-movie-list", movieController.getMovieList);
router.get("/get-single-movie", movieController.getSingleMovie);

export default router;
