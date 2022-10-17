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
router.get(
  "/get-single-movie/:imdb_code",
  [auth],
  movieController.getSingleMovie
);

// Routes for Video Player
router.get("/player/:imdbCode/:token"/* , [auth] */, movieController.playMovie);

// Routes to set movie watched
router.post("/watched/:imdb_code", [auth], movieController.setMovieWatched);

// Routes for Video Subtitles
router.get(
  "/:imdb_code/subtitles/:lang",
  subtitlesController.getSubtitles
);

export default router;
