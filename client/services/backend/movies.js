const API = 'http://localhost:8000'

export const GET_MOVIE_LIST = params => {
  const query = new URLSearchParams(params).toString()
  return `${API}/movie/get-movie-list?${query}`
}

const getMoviesList = async (accessToken, params) => {
  try {
    const url = GET_MOVIE_LIST(params)

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
    // TODO: back-to server before pull request
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

const setMovieWatched = async (accessToken, imdb_code) => {
  try {
    const url = `${API}/movie/watched/${imdb_code}`
    if (!accessToken) {
      throw new Error('No access token provided')
    }

    const res = await fetch(url, {
      method: 'post',
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

 //const getMovieSubtitles = async (accessToken, imdb_code, lang) => {
	const getMovieSubtitles = async (imdb_code, lang) => {
		try {
			const url = `http://localhost:8000/movie/${imdb_code}/subtitles/${lang}`
	
			/* if (!accessToken) {
			   throw new Error('No access token provided')
			} */
	
			const res = await fetch(url, {
				method: 'get',
				headers: {
				//	Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			})
			const data = res;
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
  addComment,
	setMovieWatched,
	getMovieSubtitles,
}
