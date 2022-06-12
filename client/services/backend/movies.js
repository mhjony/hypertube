// import fetch from 'isomorphic-unfetch'

const API = 'http://localhost:8000'

const getMoviesList = async() => {
  const res = await fetch(`${API}/movie/get-movie-list`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })

	const data = await res.json();
	return data;
}

export default {
  API,
  getMoviesList
}
