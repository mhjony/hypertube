/*
 * Place movie stuff here.
 */
import axios from "axios";

const buildMovieList = async (filters) => {
  let movies = [];
  let hasMore = true;
  const params = {
    limit: 20,
    page: filters.page || 1,
  };
  try {
    const TORRENT_API = "https://yts.mx/api/v2/list_movies.json";
    const OMDB_KEY = "bba736e8";
    // let res = await axios.get(`${process.env.TORRENT_API}`, { params });
    let res = await axios.get(`${TORRENT_API}`, {
      params,
    });
    const moviesData = res.data.data;
    const movieList = res.data.data.movies;
    console.log("Movie list: ");
    console.log(movieList);

    if (moviesData.movie_count === 0) {
      console.log("Error, no movies found!"); //throw notFoundError();
    }
    if (moviesData.movie_count <= params.limit * params.page) {
      hasMore = false;
    }
    if (movieList) {
      await Promise.all(
        movieList.map(async (movie) => {
          res = await axios.get(
            `http://www.omdbapi.com/?i=${movie.imdb_code}&apikey=${OMDB_KEY}`
          );
          movie.thumbnail = res.data.Poster; // eslint-disable-line no-param-reassign
        })
      );
      movies = movieList; //.map((movie) => filterMovieData(movie));
    }
  } catch (e) {
    return { movies: [], hasMore: false, e };
  }
  return { movies, hasMore };
};

export default {
  buildMovieList,
};
