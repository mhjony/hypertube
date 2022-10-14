const API = 'http://localhost:8000'

// Generate Query params for GET_MOVIE_LIST
const generateQueryParams = (filter, search) => {
  console.log('asd filter in generateQueryParams', filter)
  let params = Object.keys(filter).reduce((result, key) => {
    if (key === 'sort' && filter[key]) {
      const sorts = filter[key].split(' ')
      result += `&sort_by=${sorts[0]}&order_by=${sorts[1]}`
    } else {
      result += filter[key] ? `&${key}=${filter[key]}` : ''
    }

    return result
  }, '')
  if (!filter.sort) {
    params += search ? '&sort_by=title&order_by=asc' : '&sort_by=rating&order_by=desc'
  }
  params += search ? `&search=${search}` : ''

  return params
}

const getMoviesList = async (accessToken, filter, search) => {
  try {
    console.log('asd search 02', search)

    const params = generateQueryParams(filter, search)

    console.log('asd params', params)

    const url = `${API}/movie/get-movie-list?${params}`

    console.log('asd service getMoviesList url::: ', url)

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

export default {
  API,
  getMoviesList
}
