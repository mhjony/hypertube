import React, { useEffect, useState, useMemo } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'

import api from '../services/backend/movies'

import Modal from './Modal'
import DateRange from './DateRange'
import MovieDisplay from './MovieDisplay'
import FormInput from './FormInput'
import Loader from './Loader'

dayjs.extend(isToday)
dayjs.extend(relativeTime)

const MovieSearch = ({ session }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const getMovies = async session => {
    try {
      setLoading(true)
      const { accessToken } = session

      const params = {
        page
      }

      const res = (await api.getMoviesList(accessToken, params)) || []

      if (res?.error) {
        throw new Error(res.error)
      }

      setMovies(prevMovies => {
        return [...new Set([...prevMovies, ...res?.movies])]
      })

      setHasMore(res?.hasMore)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleScroll = async () => {
    if (loading || !hasMore) {
      return
    }

    const { scrollHeight } = document.documentElement
    const { scrollTop } = document.documentElement
    const { clientHeight } = document.documentElement

    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  useEffect(() => {
    getMovies(session)
  }, [session, page])

  const oldestVid = movies?.sort((a, b) => new Date(a.date_uploaded) - new Date(b.date_uploaded))[0]

  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date(oldestVid?.date_uploaded || null))
  const [endDate, setEndDate] = useState(new Date())
  const [search, setSearch] = useState('')
  const [searchByGenre, setSearchByGenre] = useState('')

  const startDateMs = startDate.getTime()
  const endDateMs = endDate.getTime()

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }

  const searchSplit = search.toLowerCase().split(' ')
  const filteredMovies = movies
    ?.filter(video => {
      // Search By name
      let matchesSearchFilter = true
      if (search.length > 0) {
        const name = (video.title || '').toLowerCase()
        matchesSearchFilter = !searchSplit.some(splitted => !name.includes(splitted))
      }

      // Filter by Genre
      let movieByGenre = true
      if (searchByGenre?.length > 0) {
        const genre = video.genres || []
        movieByGenre = genre.some(genre => genre.toLowerCase().includes(searchByGenre))
      }

      // Filter by Production year
      const videoUploaded = new Date(video.date_uploaded).getTime()
      const inDateRange = videoUploaded >= startDateMs && videoUploaded <= endDateMs

      return matchesSearchFilter && movieByGenre && inDateRange
    })
    .sort((a, b) => new Date(b.date_uploaded) - new Date(a.date_uploaded))

  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  const isMovieDataPresent = movies?.length > 0

  return (
    <div>
      {session && isMovieDataPresent && (
        <div className="bg-slate-800 w-full pb-4 flex items-center justify-around mb-0.5 rounded gap-4">
          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Search By name</p>
            <FormInput
              isValid={search?.length > 0}
              placeholder="Search by Name"
              onChange={val => setSearch(val)}
              value={search}
            />
          </div>

          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Search By Genre</p>
            <FormInput
              isValid={searchByGenre?.length > 0}
              placeholder="Search by Genre"
              onChange={val => setSearchByGenre(val)}
              value={searchByGenre}
            />
          </div>

          <div>
            <p className="text-md text-white uppercase">Filter By date</p>
            <button
              type="button"
              onClick={() => setDateModalOpen(true)}
              className="inline-block px-6 py-2 border-2 border-gray-500 text-gray-200 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              {formattedStart === formattedEnd
                ? formattedStart
                : `${formattedStart} — ${formattedEnd}`}
            </button>
          </div>

          <Modal center isOpen={dateModalOpen} close={() => setDateModalOpen(false)}>
            <DateRange
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Modal>
        </div>
      )}
      <MovieDisplay filteredMovies={filteredMovies} loading={loading} />
      {hasMore && (
        <div className="flex justify-center items-center pt-12">
          <Loader className="" />
        </div>
      )}
    </div>
  )
}

export default MovieSearch
