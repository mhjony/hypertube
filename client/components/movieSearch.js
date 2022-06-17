import React, { useEffect, useState } from 'react'
import { signIn, useSession, getProviders } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api from '../services/backend/movies'

const MovieSearch = () => {
	const [movies, setMovies] = useState([])
	const getAffiliateData = async () => {
    setLoading(true)
    
    setLoading(false)
  }
	const getMovies = async() => {
		try {
      const res = await api.getMoviesList()
      if (res.error) {
        throw new Error(res.error)
      } else {
        setMovies(res)
      }
    } catch (err) {
      console.log(err)
    }
	}

	useEffect(() => {
			getMovies();
		}, [])
	
	let moviesToShow = movies.movies ? movies.movies.map((movie) => {
		return (
			<div key={movie.imbd_id} >
				<h1>{movie.title}</h1>
				<img src={movie.thumbnail}></img>
			</div>
		);
	}
	) : null

  return (
    <div>
      {moviesToShow}
    </div>
  )
}

export default MovieSearch
