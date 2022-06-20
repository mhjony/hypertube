// import fetch from 'isomorphic-unfetch'

const API = 'http://localhost:8000'

const getMoviesList = async () => {
  console.log('I am in getMoviesList Service')
  const res = await fetch(`${API}/movie/get-movie-list`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()
  console.log('I am the movie data', data)
  return data
}

export default {
  API,
  getMoviesList
}
