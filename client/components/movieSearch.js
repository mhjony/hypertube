import React, { useEffect, useState } from 'react'

import api from '../services/backend/movies'

import SearchAndFilter from './SearchAndFilter'

const MovieSearch = ({ session }) => {
  const [movies, setMovies] = useState([])

  const getMovies = async session => {
    try {
      const { accessToken } = session

      const res = await api.getMoviesList(accessToken)

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
    getMovies(session)
  }, [session])

  return (
    <>
      <SearchAndFilter movies={movies} />
    </>
  )
}

export default MovieSearch
