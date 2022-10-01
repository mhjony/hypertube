import pool from "../config/database.js";
import NodeCache from "node-cache";
import axios from "axios";
import movieUtils from "../utils/movie.js";
import torrentUtils from "../utils/torrent.js";

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
  const filters = {
    page: req.query.page || 1,
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
  const { imdb_code } = req.params;
  console.log("get-single-movie end-point Hit", imdb_code);

  const movieInfo = await movieUtils.getMovieInfo(imdb_code);
  //const user = await User.findById(userId);

  /*movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.watched = user.watched.some((elem) => elem.movieId === movie.imdbCode);
    return tempMovie;
  });*/
  let comments = [];
  let subtitles = [];
  const ret = movieUtils.formatSingleMovieEntry(movieInfo, comments, subtitles);
  res.status(200).json(ret);
};

const playMovie = async (req, res, next) => {
	console.log('Endpoint hit: play movie');
  const { imdbCode } = req.params;
  let movie = await movieUtils.fetchSingleMovie({ imdbCode });
	//console.log('Fetch single return 1:');
	//console.log(movie);
	console.log('Fetch single return 2:');
	console.log(movie);
	req.imdb_code = imdbCode;
  req.serverLocation = movie.server_location;
  req.movieSize = movie.size;
	//console.log(req, res, next);
  torrentUtils.startFileStream(req, res, next);
  if ((!movie || !movie.downloadComplete) && !downloadCache.has(imdbCode)) {
    if (!movie) {
      movie = { imdbCode };
    }
		let magnetLink = '';
    if (!movie.magnetLink) magnetLink = await torrentUtils.getMagnetLink(imdbCode);
    await torrentUtils.downloadMovie(movie, magnetLink, downloadCache);
		console.log('Movie downloaded, going to fetch updated data.');
    movie = await movieUtils.fetchSingleMovie({ imdbCode });
  }
	
};

const downloadMovie = async (req, res, next) => {
  console.log("movie-download end-point Hit");
  //const { string } = req.query;
  const { imdbCode } = req.query;
  try {
    // Get movie data here, if available in database. Put into let movie, if it exists.
    let movie = { imdbCode };
    const magnet = await torrentUtils.getMagnetLink(imdbCode);
    console.log("magnet:");
    console.log(magnet);
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

export default {
  getMovieList,
  movieSearch,
  addComment,
  getMovieComments,
  getSingleMovie,
  playMovie,
  downloadMovie,
};
