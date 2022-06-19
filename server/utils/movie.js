/*
* Place movie stuff here.
*/
import axios from 'axios';

const filterMovieData = (movie) => ({
	title: movie.title,
	imbdID: movie.imdb_code,
	year: movie.year,
	thumbnail: movie.thumbnail,
	seeds: movie.torrents.reduce((a, b) => (b.size_bytes < a.size_bytes ? b : a)).seeds,
});

const buildMovieList = async (filters) => {
  let movies = [];
  let hasMore = true;
  const params = {
    limit: 20,
    page: filters.page || 1,
    /*minimum_rating: filters.rating || 0,
    genre: filters.genre,
    sort_by: filters.sort_by,
    order_by: filters.order_by,
    query_term: filters.search || '',*/
  };
  //onsole.log('In buildMovieList.');
  try {
    let res = await axios.get(`${process.env.TORRENT_API}`, { params });
    const moviesData = res.data.data;
    const movieList = res.data.data.movies;
    console.log('Movie list: ');
    console.log(movieList);

    if (moviesData.movie_count === 0) {
      console.log('Error, no movies found!');//throw notFoundError();
    }
    if (moviesData.movie_count <= params.limit * params.page) {
      hasMore = false;
    }
    if (movieList) {
      await Promise.all(
        movieList.map(async (movie) => {
          res = await axios.get(`http://www.omdbapi.com/?i=${movie.imdb_code}&apikey=${process.env.OMDB_KEY}`);
		  movie.thumbnail = res.data.Poster; // eslint-disable-line no-param-reassign
			movie.omdbData = res.data;
			res.imdbRating = res.data.imdbRating;
        }),
      );
      movies = movieList.map((movie) => filterMovieData(movie));
    }
  } catch (e) {
    return { movies: [], hasMore: false, e };
  }
  return { movies, hasMore };
};

const getTorrentData = async (imbdID) => {
	try {
		const res = await axios.get(`${process.env.TORRENT_API}?query_term=${imbdID}`);
		const data = res.data.data;
		if (res.status !== 200 || data.movie_count === 0 ) {
			console.log('Error');
		}
		return data;
	} catch (e) {
		// Error.
	}
}

const parseTorrentInfo = res => {
	if (res && res.data && res.data.data && res.data.data.movies && res.data.data.movies[0]) {
		return {
			Title: res.data.data.movies[0].title || '',
			imdbRating: res.data.data.movies[0].rating || '',
			Year: res.data.data.movies[0].year || '',
			Genre: res.data.data.movies[0].genres && movie.genres.join(', ') || '',
			Plot: res.data.data.movies[0].description_full || '',
			Runtime: '',
			Director: '',
			Actors: '',
		}
	}
	console.log('Error!');
}

const getMovieInfo = async (imbdID) => {
	let res;
	let movieInfoData;
	try {
		res = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&${process.env.OMDB_KEY}`);
		movieInfoData = res.data;

	} catch (e) {
		res = await axios.get(`${process.env.TORRENT_API}?query_term=${imbdID}`);
		const data = parseTorrentInfo(res);
	}
}

const getSingleMovieEntry = (movieInfo, comments, subtitles) => ({
	title: movieInfo.Title,
			imdbRating: movieInfo.imdbRating,
			year: movieInfo.Year,
			genre: movieInfo.Genre,
			description: movieInfo.Plot,
			runtime: parseInt(movieInfo.Runtime, 10),
			director: movieInfo.Director,
			actors: movieInfo.Actors,
			comments,
			subtitles
});

export default {
  buildMovieList,
	getMovieInfo,
	getSingleMovieEntry,
	getTorrentData
};