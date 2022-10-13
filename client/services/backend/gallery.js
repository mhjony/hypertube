const API = 'http://localhost:8000/movie/get-all-movies'

export const GET_MOVIE_LIST = params => {
  const query = new URLSearchParams(params).toString()
  return `${API}/movie/get-movie-list?${query}`
}


const generateQueryParams = (filter, search) => {
	let params = Object.keys(filter).reduce((result, key) => {
	  if (key === 'sort' && filter[key]) {
		const sorts = filter[key].split(' ');
		result += `&sort_by=${sorts[0]}&order_by=${sorts[1]}`;
	  } else {
		result += filter[key] ? `&${key}=${filter[key]}` : '';
	  }
  
	  return result;
	}, '');
	if (!filter.sort) {
	  params += search ? '&sort_by=title&order_by=asc' : '&sort_by=rating&order_by=desc';
	}
	params += search ? `&search=${search}` : '';
  
	return params;
  };


  const getAllMovies = async (accessToken, filter, search) => {
	try {

	const params = generateQueryParams(filter, search);

	const url = `${API} + ?page=${page}${params}`;
  
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
  getAllMovies
}
