import express from "express";
import movieController from "../controllers/movieController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Router for movie comments
router.get("/comments/:imdb_code", [auth], movieController.getMovieComments);
router.post("/comment/add/:imdb_code", [auth], movieController.addComment);

// Routes for getting movies
router.get("/get-movie-list", [auth], movieController.getMovieList);
//router.get("/get-movie-list", movieController.getMovieList);
// Routes for downloading/playing movies
// router.get("/get-single-movie", movieController.getSingleMovie);
router.get("/get-single-movie/:imdb_code", [auth], movieController.getSingleMovie);

//router.get('/:imdbCode/player/:token', inputValidator.validateToken, movieController.playMovie);
router.get("/player/:imdbCode", movieController.playMovie);
//router.get("/download", [auth], movieController.downloadMovie);

export default router;
