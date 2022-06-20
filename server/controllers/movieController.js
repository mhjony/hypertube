/*
  Fields for movie DB:
  imbd rating: float
  year: int
  genre: string
  description: string
  director: string
  cast: actor array (IDs to other table?)
  comments: comment table IDs
  subtitles: langcodes?

  Comments table:
  comment_body: string
  user: user id?
  */

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
    tempMovie.watched = user.watched.some((elem) => elem.movieId === movie.imdbCode);
    return tempMovie;
  });*/
  res.json(movies);
};

export default {
  getMovieList,
};
