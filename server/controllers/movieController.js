import pool from "../config/database.js";
import axios from "axios";
import movieUtils from "../utils/movie.js";

// @route   GET /movie-search
// @desc    return movie search results
// @access  Public
const movieSearch = async (req, res) => {
  console.log("movie-search end-point Hit");
  const { string } = req.query;

  const ret = await axios.get(
    `http://www.omdbapi.com/?t=${string}&apikey=${process.env.OMDB_KEY}`
  );
  console.log("Ret:");
  console.log(ret);
  return res.send(ret.data);
};

// @route   GET /get-movie-list
// @desc    return movie list
// @access  Public
const getMovieList = async (req, res) => {
  console.log("getMovieList end-point Hit");
  //const userId = req.user;
  //const filters = req.query;
  const filters = {
    page: 1,
    minimum_rating: 0,
    /*genre: filters.genre,
    sort_by: filters.sort_by,
    order_by: filters.order_by,
    query_term: filters.search || '',*/
  };
  const movies = await movieUtils.buildMovieList(filters);
  //const user = await User.findById(userId);

  /*movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.watched = user.watched.some((elem) => elem.imdb_code  === movie.imdbCode);
    return tempMovie;
  });*/
  res.json(movies);
};

// @route   POST /movie/comments/add/:imdb_code
// @desc    return movie search results
// @access  Private
const addComment = async (req, res) => {
  const { imdb_code } = req.params;
  const { user_id, comment_body } = req.body;

  const newUser = await pool.query(
    "INSERT INTO comments (user_id, imdb_code, comment_body) VALUES ($1, $2, $3) RETURNING *",
    [user_id, imdb_code, comment_body]
  );

  return res
    .status(200)
    .json({ success: true, message: "Comment added successfully" });
};

// @route   GET /movie/comments/:imdb_code
// @desc    return movie search results
// @access  Private
const getMovieComments = async (req, res) => {
  const { imdb_code } = req.params;

  const comments = await pool.query(
    "SELECT * FROM comments WHERE imdb_code = $1",
    [imdb_code]
  );
  return res.status(200).json(comments.rows);
};

export default {
  getMovieList,
  movieSearch,
  addComment,
  getMovieComments,
};
