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
  const user_id = req.user.user_id;
  const filters = req.query;

  const movies = await movieUtils.buildMovieList(filters);

  //2. Find the user
  const user = await findUserInfoFromDB("user_id", user_id);

  movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.movies_watched = user.movies_watched.some(
      (elem) => elem === movie.imdb_code
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

  // Get the comments user info and add it to the comment object
  await Promise.all(
    comments.rows.map(async (comment) => {
      const user = await findUserInfoFromDB("user_id", comment.user_id);
      comment.user = user;
      return comment;
    })
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
  const subtitles = await subtitlesUtils.getSubtitles(imdb_code);

  const ret = movieUtils.formatSingleMovieEntry(movieInfo, subtitles);
  res.status(200).json(ret);
};

const playMovie = async (req, res, next) => {
  const { imdbCode } = req.params;
  let movie = await movieUtils.fetchSingleMovie({ imdbCode });
  if ((!movie || !movie.downloadComplete) && !downloadCache.has(imdbCode)) {
    if (!movie) {
      movie = { imdbCode };
    }
    let magnetLink = "";
    if (!movie.magnetLink)
      magnetLink = await torrentUtils.getMagnetLink(imdbCode);
    await torrentUtils.downloadMovie(movie, magnetLink, downloadCache);
    movie = await movieUtils.fetchSingleMovie({ imdbCode });
  }
  req.serverLocation = movie.serverLocation;
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
  // const comments = await getMovieComments(imdb_code);
  // res.json(movieUtils.formatSingleMovieEntry(movieInfo, comments, subtitles));
  res.json(movieUtils.formatSingleMovieEntry(movieInfo, subtitles));
};
*/

// Set Movie Watched
const setMovieWatched = async (req, res) => {
  try {
    const { imdb_code } = req.params;
    const { user_id } = req.user;

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
  setMovieWatched,
};
