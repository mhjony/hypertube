import pool from "../config/database.js";
import NodeCache from "node-cache";
import axios from "axios";
import movieUtils from "../utils/movie.js";
import torrentUtils from "../utils/torrent.js";
import subtitlesUtils from "../utils/subtitlesAPI.js";

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
  const { page } = req.query;

  const filters = {
    page: page || 1,
    minimum_rating: 0,
    /*genre: filters.genre,
    sort_by: filters.sort_by,
    order_by: filters.order_by,
    query_term: filters.search || '',*/
  };
  const movies = await movieUtils.buildMovieList(filters);
	//console.log(movies)
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

// @route   GET /get-single-movie/:imdb_code
// @desc    return movie list
// @access  Public
const getSingleMovie = async (req, res) => {
	//const { imdb_code, language } = req.params;
	const { imdb_code } = req.params;
	console.log("get-single-movie end-point Hit", imdb_code);
	//console.log(language);

  const movieInfo = await movieUtils.getMovieInfo(imdb_code);
	console.log(movieInfo);
	const newMovie = await movieUtils.insertMovie(imdb_code);
	console.log('New movie: ', newMovie);
  //const user = await User.findById(userId);

  /*movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.watched = user.watched.some((elem) => elem.movieId === movie.imdbCode);
    return tempMovie;
  });*/
	const subtitles = await subtitlesUtils.getSubtitles(imdb_code);
	//console.log(subtitles);
  const ret = movieUtils.formatSingleMovieEntry(movieInfo, subtitles);
	console.log(ret);
  res.status(200).json(ret);
};

const playMovie = async (req, res, next) => {
	console.log('Endpoint hit: play movie');
  const { imdbCode } = req.params;
  let movie = await movieUtils.fetchSingleMovie({ imdbCode });
	console.log('Movie', movie);

  if (!movie.downloaded && !downloadCache.has(imdbCode)) {
		console.log('Here.');
    if (!movie) {
      movie = { imdbCode };
    }
    let magnetLink = "";
    if (!movie.magnetLink)
      magnetLink = await torrentUtils.getMagnetLink(imdbCode);
    await torrentUtils.downloadMovie(movie, magnetLink, downloadCache);
    movie = await movieUtils.fetchSingleMovie({ imdbCode });
  }
	req.imdb_code = imdbCode;
	req.serverLocation = movie.server_location;
	req.movieSize = movie.size;
	torrentUtils.startFileStream(req, res, next);
};

const downloadMovie = async (req, res, next) => {
  console.log("movie-download end-point Hit");
  //const { string } = req.query;
  const { imdbCode } = req.query;
  try {
    // Get movie data here, if available in database. Put into let movie, if it exists.
    let movie = { imdbCode };
    const magnet = await torrentUtils.getMagnetLink(imdbCode);
    //console.log("magnet:");
    //console.log(magnet);
    await torrentUtils.downloadMovie(movie, magnet, downloadCache);
    //await torrentUtils.downloadMovie(movie, downloadCache);
    // Get movie data here again, because it might be updated, and now we can get the server location and size.
    //req.serverLocation = movie.serverLocation;
    //req.movieSize = movie.size;
    //torrentUtils.startFileStream(req, res, next);
    return res.status(200).send(magnet).end();
  } catch (e) {
    // Error.
  }
};

// Get movie Entry
const getMovieEntry = async (req, res) => {
  const { imdb_code, language } = req.params;
	console.log(language);

  const movieInfo = await movieUtils.getMovieInfo(imdb_code);
  const subtitles = await subtitlesUtils.getSubtitles(imdb_code);
  //const comments = await fetchComments(imdb_code);
  res.json(movieUtils.formatSingleMovieEntry(movieInfo/*, comments*/, subtitles));
  //res.json(movieUtils.formatSingleMovieEntry(movieInfo));
};

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
  downloadMovie,
  getMovieEntry,
  setMovieWatched,
};
