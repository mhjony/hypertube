import express from "express";
import movieController from "../controllers/movieController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/get-movie-list", [auth], movieController.getMovieList);

// Router for movie comments
router.get("/comments/:imdb_code", [auth], movieController.getMovieComments);
router.post("/comment/add/:imdb_code", [auth], movieController.addComment);

export default router;
