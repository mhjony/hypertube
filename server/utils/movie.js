import axios from "axios";
import pool from "../config/database.js";

const buildMovieList = async (filters) => {
  let movies = [];
  let hasMore = true;
  const params = {
    limit: 20,
    page: filters.page || 1,
    minimum_rating: filters.imdb || 0,
    genre: filters.genre,
    sort_by: filters.sort_by,
    order_by: filters.order_by,
    query_term: filters.search || "",
  };
  const previousPage = parseInt(params.page) - 1;
  const nextPage = parseInt(params.page) + 1;
  try {
    let res = await axios.get(`${process.env.TORRENT_API}`, { params });
    const moviesData = res.data.data;
    const movieList = res.data.data.movies;

    if (moviesData.movie_count <= params.limit * params.page) {
      hasMore = false;
    }
    if (movieList) {
      await Promise.all(
        movieList.map(async (movie) => {
          res = await axios.get(
            `http://www.omdbapi.com/?i=${movie.imdb_code}&apikey=${process.env.OMDB_KEY}`
          );
          movie.thumbnail = res.data.Poster; // eslint-disable-line no-param-reassign
        })
      );
      movies = movieList;
    }
  } catch (e) {
    return { movies: [], hasMore: false, e };
  }

  return { movies, hasMore, previousPage, nextPage };
};

const insertMovie = async (imdbCode) => {
	try {
		const res = await axios.get(`${process.env.TORRENT_API}?query_term=${imdbCode}`);
		const data = res.data.data;

		if (res.status !== 200 || data.movie_count === 0 ) {
			console.error('Get torrentData error.');
		}
		const { hash } = data.movies[0].torrents.reduce((current, previous) => previous.size_bytes < current.size_bytes ? previous : current);
		const magnet = `magnet:?xt=urn:btih:${hash}&dn=${data.movies[0].title_long.split(' ').join('+')}`;
		const movie = await pool.query("SELECT * FROM movies WHERE imdb_code = $1", [
      imdbCode,
    ]);
		
		let ret;
		if (movie.rowCount === 0) {
		ret = await pool.query(
			"INSERT INTO movies (imdb_code, magnet, title) VALUES ($1, $2, $3)",
			[imdbCode, magnet, data.movies[0].title_long]
		);
			
		}
		return ret;
	} catch (e) {
		console.error(e);
	}
}

const updateMovie = async (imdbCode, magnetLink, serverLocation, size) => {
  try {
    //1. check if movie exists in the db.
    const movie = await pool.query("SELECT * FROM movies WHERE imdb_code = $1", [
      imdbCode,
    ]);

    // if movie does not exist, then throw error
    if (movie.rows.length === 0) {
      console.error("UPDATE 2: Movie doesn't exit.");
    }
    const updatedMovie = await pool.query(
      "UPDATE movies SET magnet = $1, server_location = $2, size = $3 WHERE imdb_code = $4 RETURNING *",
      [magnetLink, serverLocation, size, imdbCode]
    );
    return updatedMovie.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};

const filterMovieData = (movie) => ({
  title: movie.title,
  imbdID: movie.imdb_code,
  year: movie.year,
  thumbnail: movie.thumbnail,
  seeds: movie.torrents.reduce((a, b) => (b.size_bytes < a.size_bytes ? b : a))
    .seeds,
});

const getTorrentData = async (imdbID) => {
	try {
		const res = await axios.get(`${process.env.TORRENT_API}?query_term=${imdbID}`);
		const data = res.data.data;

		if (res.status !== 200 || data.movie_count === 0 ) {
			console.error('Get torrentData error.');
		}
		const { hash } = data.movies[0].torrents.reduce((current, previous) => previous.size_bytes < current.size_bytes ? previous : current);
		const magnet = `magnet:?xt=urn:btih:${hash}&dn=${data.movies[0].title_long.split(' ').join('+')}`;
		const movie = await pool.query("SELECT * FROM movies WHERE imdb_code = $1", [
      imdbID,
    ]);
		
		if (movie.rowCount === 0) {
		const ret = await pool.query(
			"INSERT INTO movies (imdb_code, magnet, title) VALUES ($1, $2, $3)",
			[imdbID, magnet, data.movies[0].title_long]
		);
			
		}
		return magnet;
	} catch (e) {
		console.error(e);
	}
};

const parseTorrentInfo = (res) => {
  if (
    res &&
    res.data &&
    res.data.data &&
    res.data.data.movies &&
    res.data.data.movies[0]
  ) {
    return {
      Title: res.data.data.movies[0].title || "",
      imdbRating: res.data.data.movies[0].rating || "",
      Year: res.data.data.movies[0].year || "",
      Genre:
        (res.data.data.movies[0].genres &&
          res.data.data.movies[0].genres.join(", ")) ||
        "",
      Plot: res.data.data.movies[0].description_full || "",
      Runtime: "",
      Director: "",
      Actors: "",
    };
  }
  console.error("Error!");
};

const getMovieInfo = async (imdbID) => {
  let res;
  let movieInfoData;
  try {
    const TORRENT_API = "https://yts.mx/api/v2/list_movies.json";
    const OMDB_KEY = "bba736e8";

    const res = await axios.get(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_KEY}`
    );
    movieInfoData = res.data;
    return movieInfoData;
  } catch (e) {
    // res = await axios.get(`${process.env.TORRENT_API}?query_term=${imbdID}`);
    res = await axios.get(`${process.env.TORRENT_API}?query_term=${imdbID}`);
    const data = parseTorrentInfo(res);
    return data;
  }
};

const formatSingleMovieEntry = (movieInfo, subtitles) => ({
  title: movieInfo.Title,
  imdbRating: movieInfo.imdbRating,
  year: movieInfo.Year,
  releasedDate: movieInfo.Released,
  genre: movieInfo.Genre,
  description: movieInfo.Plot,
  runtime: parseInt(movieInfo.Runtime, 10),
  director: movieInfo.Director,
  actors: movieInfo.Actors,
  thumbnail: movieInfo.Poster,
  imdb_code: movieInfo.imdbID,
	subtitles,
});

const fetchSingleMovie = async (imdbCode) => {
  try {
    //2. check if movie exists in the db.
  const movie = await pool.query("SELECT * FROM movies WHERE imdb_code = $1", [
      imdbCode.imdbCode
    ]);

    // if movie does not exist, then throw error
    if (movie.rows.length === 0) {
      return res.status(401).send("FETCH: Movie doesn't exit.");
    }

    return movie.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};

const setMovieAsDownloaded = async (imdbCode) => {
  try {
    //1. check if movie exists in the db.
    const movie = await pool.query(
      "SELECT * FROM movies WHERE imdb_code = $1",
      [imdbCode]
    );

    // if movie does not exist, then throw error
    if (movie.rows.length === 0) {
      console.error("UPDATE: Movie doesn't exit.");
    }

    const updatedMovie = await pool.query(
      "UPDATE movies SET downloaded = 1 WHERE imdb_code = $1 RETURNING *",
      [imdbCode]
    );
    return updatedMovie.rows[0];
  } catch (err) {
    console.error(err.message);
  }
};

export default {
  fetchSingleMovie,
  updateMovie,
  buildMovieList,
  getMovieInfo,
  formatSingleMovieEntry,
  getTorrentData,
  setMovieAsDownloaded,
	insertMovie
};
