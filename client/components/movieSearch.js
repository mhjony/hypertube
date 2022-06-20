import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import api from '../services/backend/movies'

import SearchAndFilter from './SearchAndFilter'

const MovieSearch = () => {
  const [movies, setMovies] = useState([])

  const getAffiliateData = async () => {
    setLoading(true)

    setLoading(false)
  }
  const getMovies = async () => {
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
    getMovies()
  }, [])

  return (
    <div>
      <h1 className="flex content-center text-3xl font-bold mb-4">Filter and Search Movie</h1>

      <SearchAndFilter movies={movies} />
    </div>
  )
}

export default MovieSearch
