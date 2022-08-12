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
import NodeCache from 'node-cache';

import axios from "axios";
import movieUtils from '../utils/movie.js';
import torrentUtils from '../utils/torrent.js';

const downloadCache = new NodeCache({ checkPeriod: 0 });

// @route   GET /movie-search
// @desc    return movie search results
// @access  Public
const movieSearch = async (req, res) => {
  console.log("movie-search end-point Hit");
  const { string } = req.query;

  const ret = await axios.get(`http://www.omdbapi.com/?t=${string}&apikey=${process.env.OMDB_KEY}`);
  console.log('Ret:');
  console.log(ret);
  return res
        .send(ret.data);
};

// @route   GET /get-movie-list
// @desc    return movie list
// @access  Public
const getMovieList = async (req, res) => {
	console.log("get-movie-list end-point Hit");
  //const userId = req.user;
  //const filters = req.query;
  const filters = {
    page: 1,
    minimum_rating: 0,
    /*genre: filters.genre,
    sort_by: filters.sort_by,
    order_by: filters.order_by,
    query_term: filters.search || '',*/
  }
  const movies = await movieUtils.buildMovieList(filters);
  //const user = await User.findById(userId);

  /*movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.watched = user.watched.some((elem) => elem.movieId === movie.imdbCode);
    return tempMovie;
  });*/
  res.json(movies);
};

// @route   GET /get-single-movie
// @desc    return movie list
// @access  Public
const getSingleMovie = async (req, res) => {
	console.log("get-single-movie end-point Hit");
  const { id } = req.query;
	console.log(id);
  const movieInfo = await movieUtils.getMovieInfo(id);
  //const user = await User.findById(userId);

  /*movies.movies = movies.movies.map((movie) => {
    const tempMovie = { ...movie };
    tempMovie.watched = user.watched.some((elem) => elem.movieId === movie.imdbCode);
    return tempMovie;
  });*/
	let comments = [];
	let subtitles = [];
	//console.log(movieInfo);
	const ret = movieUtils.formatSingleMovieEntry(movieInfo, comments, subtitles);
  res.json(ret);
};

const playMovie = async (req, res, next) => {
  
  const { imdbCode } = req.params;
  /*let movie = await Movie.findOne({ imdbCode });
  if ((!movie || !movie.downloadComplete) && !downloadCache.has(imdbCode)) {
    if (!movie) {
      movie = { imdbCode };
    }
    if (!movie.magnet) movie.magnet = await movieTorrentUtils.getMagnet(imdbCode);
    await movieTorrentUtils.downloadMovie(movie, downloadCache);
    movie = await Movie.findOne({ imdbCode });
  }
  req.serverLocation = movie.serverLocation;
  req.movieSize = movie.size;
  movieTorrentUtils.startFileStream(req, res, next);*/
};

const downloadMovie = async (req, res, next) => {
	console.log("movie-download end-point Hit");
	//const { string } = req.query;
  const { imdbCode } = req.query;
	try {
		// Get movie data here, if available in database. Put into let movie, if it exists.
		let movie = { imdbCode };
		const magnet = await torrentUtils.getMagnetLink(imdbCode);
		console.log('magnet:');
		console.log(magnet);
    await torrentUtils.downloadMovie(movie, magnet, downloadCache);
		//await torrentUtils.downloadMovie(movie, downloadCache);
		// Get movie data here again, because it might be updated, and now we can get the server location and size.
		//req.serverLocation = movie.serverLocation;
		//req.movieSize = movie.size;
		//torrentUtils.startFileStream(req, res, next);
		return res
					.status(200)
					.send(magnet)
					.end();
	} catch (e) {
		// Error.
	}
};

export default {
  getMovieList,
	getSingleMovie,
	playMovie,
	downloadMovie,
};
