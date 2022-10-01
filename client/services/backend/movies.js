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
    return data
  } catch (error) {
    return error
  }
}

// Get single movie details
const getMovieDetails = async (accessToken, imdb_code) => {
  try {
		// For docker, some requests (get?) from frontend to backend have to use 'server' and not 'localhost'.
    const url = `http://server:8000/movie/get-single-movie/${imdb_code}`

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
    return data
  } catch (error) {
    return error
  }
}

const getMovieComments = async (accessToken, imdb_code) => {
  try {
    const url = `${API}/movie/comments/${imdb_code}`

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
    return data
  } catch (error) {
    return error
  }
}

const addComment = async (accessToken, imdb_code, user_id, comment_body) => {
  try {
    const url = `${API}/movie/comment/add/${imdb_code}`

    if (!accessToken) {
      throw new Error('No access token provided')
    }

    const res = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        comment_body
      })
    })

    const data = await res.json()
    return data
  } catch (error) {
    return error
  }
}


const getFileStream = async (/*accessToken, */imdb_code) => {
  try {
    const url = `${API}/movie/player/tt0111161`//${imdb_code}

    /*if (!accessToken) {
      throw new Error('No access token provided')
    }*/

    const res = await fetch(url, {
      method: 'get',
      headers: {
        /*Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'*/
      }
    })
		console.log('Arbitrary stuff:');
		console.log(res);
    const data = await res.json()
		
    return res
  } catch (error) {
    return error
  }
}

export default {
  API,
  getMoviesList,
  getMovieDetails,
  getMovieComments,
  addComment,
	getFileStream
}
