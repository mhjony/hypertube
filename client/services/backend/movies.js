const API = 'http://localhost:8000'

const getMoviesList = async accessToken => {
  try {
    const url = `${API}/movie/get-movie-list`

    if (!accessToken) {
      throw new Error('No access token provided')
    }

    const res = await fetch(url, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    console.log('I am the movie data', data)
    return data
  } catch (error) {
    return error
  }
}

export default {
  API,
  getMoviesList
}
