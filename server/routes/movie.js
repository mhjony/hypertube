import express from "express";
import movieController from "../controllers/movieController.js";

const router = express.Router();

router.get("/get-movie-list", movieController.getMovieList);

router.get("/comments/:movieId", movieController.getMovieComments);
router.post("/comment/add/:movieId", movieController.addComment);

export default router;
