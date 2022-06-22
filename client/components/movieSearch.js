import React, { useEffect, useState } from 'react'

import api from '../services/backend/movies'

import SearchAndFilter from './SearchAndFilter'

const MovieSearch = () => {
  const [movies, setMovies] = useState([])

  const getMovies = async () => {
    try {
      const res = await api.getMoviesList()
      if (res?.error) {
        throw new Error(res.error)
      } else {
        setMovies(res)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <>
      <SearchAndFilter movies={movies} />
    </>
  )
}

export default MovieSearch
