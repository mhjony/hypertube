import React, { useEffect, useState } from 'react'

import api from '../services/backend/movies'

import SearchAndFilter from './SearchAndFilter'

const MovieSearch = ({ session }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const getMovies = async session => {
    try {
      setLoading(true)
      const { accessToken } = session

      const res = await api.getMoviesList(accessToken)

      if (res?.error) {
        throw new Error(res.error)
      } else {
        setMovies(res)
        setLoading(false)
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
      <SearchAndFilter movies={movies} session={session} loading={loading} />
    </>
  )
}

export default MovieSearch
