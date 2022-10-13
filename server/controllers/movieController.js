import pool from "../config/database.js";
import NodeCache from "node-cache";
import axios from "axios";
import movieUtils from "../utils/movie.js";
import torrentUtils from "../utils/torrent.js";
import subtitlesUtils from "../utils/subtitlesAPI.js";

const findUserInfoFromDB = async (key, value, ...args) => {
  const info = args.length == 0 ? "*" : args.join(", ");
  const res = await pool.query(`SELECT ${info} FROM users WHERE ${key} = $1`, [
    value,
  ]);
  return res.rows[0];
};

const downloadCache = new NodeCache({ checkPeriod: 0 });

// @route   GET /movie-search
// @desc    return movie search results
// @access  Public
const movieSearch = async (req, res) => {
  console.log("movie-search end-point Hit");
  const { string } = req.query;

  const ret = await axios.get(
    `http://www.omdbapi.com/?t=${string}&apikey=${process.env.OMDB_KEY}`
  );
  return res.send(ret.data);
};

// @route   GET /get-movie-list
// @desc    return movie list
// @access  Public
const getMovieList = async (req, res) => {
  console.log("getMovieList end-point Hit");
  const { page } = req.query;
  const user_id = req.user.user_id;

  const filters = {
    page: page || 1,
    minimum_rating: 0,
  };
  const movies = await movieUtils.buildMovieList(filters);

  //2. Find the user
  const user = await findUserInfoFromDB("user_id", user_id);

  movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.movies_watched = user.movies_watched.some(
      (elem) => elem.imdb_code === movie.imdb_code
    );
    return tempMovie;
  });

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

// @route   GET /get-single-movie/:imdb_code
// @desc    return movie list
// @access  Public
const getSingleMovie = async (req, res) => {
  const { imdb_code } = req.params;
  console.log("get-single-movie end-point Hit", imdb_code);
  const movieInfo = await movieUtils.getMovieInfo(imdb_code);
	const insertedMovie = movieUtils.insertMovie(imdb_code);
	console.log(insertedMovie);
  const subtitles = await subtitlesUtils.getSubtitles(imdb_code);
  const ret = movieUtils.formatSingleMovieEntry(movieInfo, subtitles);
  res.status(200).json(ret);
};

const playMovie = async (req, res, next) => {
	console.log('Endpoint hit: play movie');
  const { imdbCode, token } = req.params;
	// If no token, throw error.
	console.log('token', token);
  let movie = await movieUtils.fetchSingleMovie({ imdbCode });
	console.log('Movie', movie);
  if (!movie || (!movie.downloaded && !downloadCache.has(imdbCode))) {
		console.log('Here.');
    if (!movie) {
      movie = { imdbCode };
    }
    let magnetLink = "";
    if (!movie.magnetLink)
      magnetLink = await torrentUtils.getMagnetLink(imdbCode);
    await torrentUtils.downloadMovie(movie, magnetLink, downloadCache, req, res, next);
    movie = await movieUtils.fetchSingleMovie({ imdbCode }); // Move this? Refactoring around here.
  }
	console.log('Ready to serve stream.');
	req.imdb_code = imdbCode;
	req.serverLocation = movie.server_location;
	req.movieSize = movie.size;
	torrentUtils.startFileStream(req, res, next);
};


/*
// Get movie Entry - This is now used for the moment!
// We save same return with get-single-movie & get-comments to serve single the movie page
const getMovieEntry = async (req, res) => {
  const { imdb_code } = req.params;

  const movieInfo = await movieUtils.getMovieInfo(imdb_code);
  const subtitles = await subtitlesUtils.getSubtitles(imdb_code);
  res.json(movieUtils.formatSingleMovieEntry(movieInfo, subtitles));
};
*/

// Set Movie Watched
const setMovieWatched = async (req, res) => {
  try {
    const { imdb_code } = req.params;
    const { user_id } = req.user;
		console.log('Set movie watched.');
		console.log('imdb', imdb_code);
		

    const movie = await pool.query(
      "SELECT * FROM movies WHERE imdb_code = $1",
      [imdb_code]
    );

    if (movie.rows.length === 0) {
      console.log("Movie doesn't exit.");
    }

    const updatedMovie = await pool.query(
      "UPDATE movies SET last_watched = $1 WHERE imdb_code = $2 RETURNING *",
      [new Date(), imdb_code]
    );

    // Add imb_code to user's movie_watched column
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    if (user.rows.length === 0) {
      console.log("User doesn't exit.");
    }

    let updatedUser;

    // Check if ibd_code is already in user's movies_watched column then ignore it otherwise add it
    if (!user.rows[0].movies_watched.includes(imdb_code)) {
      updatedUser = await pool.query(
        "UPDATE users SET movies_watched = array_append(movies_watched, $1) WHERE user_id = $2 RETURNING *",
        [imdb_code, user_id]
      );
    }

    res.status(200).json({
      updatedMovie: updatedMovie.rows[0],
      message: "Movie is set to watched successfully",
    });
  } catch (err) {
    console.error(err.message);
  }
};

export default {
  getMovieList,
  movieSearch,
  addComment,
  getMovieComments,
  getSingleMovie,
  playMovie,
  // getMovieEntry,
  setMovieWatched
};
