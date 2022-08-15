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

// Get single movie details
const getMovieDetails = async (accessToken, imdb_code) => {
  try {
    console.log('asd getMovieDetails in service HIT', accessToken, imdb_code)
    const url = `${API}/movie/get-single-movie/${imdb_code}`

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
    console.log('I am the movie details data', data)
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
    console.log('asd addComment in service', accessToken, imdb_code, user_id, comment_body)
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

export default {
  API,
  getMoviesList,
  getMovieDetails,
  getMovieComments,
  addComment
}
