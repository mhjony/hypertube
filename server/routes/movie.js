import express from "express";
import movieController from "../controllers/movieController.js";
import subtitlesController from "../controllers/subtitleController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Router for movie comments
router.get("/comments/:imdb_code", [auth], movieController.getMovieComments);
router.post("/comment/add/:imdb_code", [auth], movieController.addComment);

// Routes for getting movies
router.get("/get-movie-list", [auth], movieController.getMovieList);
router.get("/get-single-movie/:imdb_code", [auth], movieController.getSingleMovie);
router.get("/player/:imdbCode", movieController.playMovie);

// Get movie entry (Return, movieDetails, subtitles, comments)
router.get("/:imdb_code", [auth], movieController.getMovieEntry);

// Set Movie as Watched
router.post("/watched/:imdb_code", [auth], movieController.setMovieWatched);

// Route for getting subtitles
router.get('/:imdb_code/subtitles/:lang', subtitlesController.getSubtitles)

export default router;
