import express from "express";
import movieController from "../controllers/movieController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/get-movie-list", [auth], movieController.getMovieList);

// Router for movie comments
router.get("/comments/:imdb_code", [auth], movieController.getMovieComments);
router.post("/comment/add/:imdb_code", [auth], movieController.addComment);
router.get("/get-movie-list", movieController.getMovieList);
// router.get("/get-single-movie", movieController.getSingleMovie);
router.get("/get-single-movie/:imdb_code", movieController.getSingleMovie);
//router.get('/:imdbCode/player/:token', inputValidator.validateToken, movieController.playMovie);
router.get("/player", movieController.playMovie);
router.get("/download", movieController.downloadMovie);

export default router;
