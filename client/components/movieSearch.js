import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'

import galleryApi from '../services/backend/gallery'

import Modal from './Modal'
import DateRange from './DateRange'
import MovieDisplay from './MovieDisplay'
import FormInput from './FormInput'
import Loader from './Loader'
import Dropdown from './Dropdown'

dayjs.extend(isToday)
dayjs.extend(relativeTime)

const manyYearsAgo = new Date()
manyYearsAgo.setDate(manyYearsAgo.getDate() - 2000)
const today = new Date()

const MovieSearch = ({ session }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({})
  const [sortBy, setSortBy] = useState('rating desc')
  const [sortByGenre, setSortByGenre] = useState('')

  const [startDate, setStartDate] = useState(manyYearsAgo)
  const [endDate, setEndDate] = useState(today)
  const [showResults, setShowResults] = useState(false)
  const [dateModalOpen, setDateModalOpen] = useState(false)

  const sortByOptions = [
    { value: 'title asc', name: 'A - Z' },
    { value: 'title desc', name: 'Z - A' },
    { value: 'year desc', name: 'Newest' },
    { value: 'year asc', name: 'Oldest' },
    { value: 'rating desc', name: 'Most Popular' },
    { value: 'rating asc', name: 'Least Popular' }
  ]

  const sortGenreOptions = [
    { value: '', name: 'All' },
    { value: 'action', name: 'Action' },
    { value: 'adventure', name: 'Adventure' },
    { value: 'animation', name: 'Animation' },
    { value: 'biography', name: 'Biography' },
    { value: 'comedy', name: 'Comedy' },
    { value: 'crime', name: 'Crime' },
    { value: 'documentary', name: 'Documentary' },
    { value: 'drama', name: 'Drama' },
    { value: 'family', name: 'Family' },
    { value: 'fantasy', name: 'Fantasy' },
    { value: 'history', name: 'History' },
    { value: 'horror', name: 'Horror' },
    { value: 'film-noir', name: 'Film noir' },
    { value: 'musical', name: 'Musical' },
    { value: 'mystery', name: 'Mystery' },
    { value: 'romance', name: 'Romance' },
    { value: 'sci-fi', name: 'Sci-fi' },
    { value: 'sport', name: 'Sport' },
    { value: 'superhero', name: 'Superhero' },
    { value: 'thriller', name: 'Thriller' },
    { value: 'war', name: 'War' }
  ]

  const getMovies = async existingMovies => {
    try {
      setLoading(true)
      const { accessToken } = session

      filter.page = page

      if (sortByGenre) {
        filter.genre = sortByGenre
      }

      if (sortBy) {
        filter = { ...filter, sort: sortBy }
      }

      const res = await galleryApi.getMoviesList(accessToken, filter, search)
      const newMovies = res?.movies

      if (res?.error) {
        throw new Error(res.error)
      }

      // setMovies([...movies, ...res?.movies])
      setMovies([...existingMovies, ...newMovies])

      setHasMore(res?.hasMore)
      setLoading(false)
    } catch (err) {
      console.error(err)
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

  const filtersChanged = async () => {
    // Reset state
    setPage(1)
    getMovies([])
  }

  useEffect(() => {
    getMovies(movies)
  }, [page])

  useEffect(() => {
    filtersChanged()
  }, [sortBy, sortByGenre, showResults === true, filter])

  const onEnterForSearch = async e => {
    e.preventDefault()
    setPage(1)
    getMovies([])
  }

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }
  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  const isMovieDataPresent = movies?.length > 0

  // API_LINK: https://yts.mx/api#list_movies
  const onInputChange = val => {
    setSearch(val)
    setShowResults(false)
  }

  const onGenreInputChange = val => {
    setSortByGenre(val)
    setPage(1)
    setMovies([])
  }

  const handleSortByChange = val => {
    setSortBy(val)
    setPage(1)
    setMovies([])
  }

  return (
    <div>
      {session && isMovieDataPresent && (
        <div className="bg-slate-800 w-full pb-4 flex items-center justify-around mb-0.5 rounded gap-4">
          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Search By name</p>
            <div className="flex">
              <FormInput
                isValid={search.length > 3}
                value={search}
                onChange={val => onInputChange(val)}
                placeholder="Search Movies"
                className="w-full"
                onEnter={onEnterForSearch}
              />
            </div>
          </div>

          <div className="w-full md:w-1/6 mt-4">
            <Dropdown
              label="SORT BY genre"
              options={sortGenreOptions}
              selected={sortByGenre}
              onChange={val => onGenreInputChange(val)}
              width={210}
            />
          </div>

          <div className="w-full md:w-1/6 mt-4">
            <Dropdown
              label="SORT BY"
              options={sortByOptions}
              selected={sortBy}
              onChange={val => handleSortByChange(val)}
              width={210}
            />
          </div>

          <div className="">
            <p className="text-md text-white uppercase mb-2">Filter By date</p>
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

      {!loading && !isMovieDataPresent && (
        <div className="text-3xl text-white text-center">
          Movie you searched for is not available in our platform
        </div>
      )}

      <MovieDisplay
        filteredMovies={movies}
        sortBy={sortBy}
        startDate={startDate}
        endDate={endDate}
        dateModalOpen={dateModalOpen}
      />
      {hasMore && (
        <div className="flex justify-center items-center pt-12">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default MovieSearch
