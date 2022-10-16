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

const MovieSearch = ({ session }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [search, setSearch] = useState('')
  const [searchByGenre, setSearchByGenre] = useState('')

  const [filter, setFilter] = useState({})
  const [clearInput, setClearInput] = useState(false)
  const [sortBy, setSortBy] = useState('rating desc')

  const sortByOptions = [
    { value: 'rating', name: 'Rating' },
    { value: 'year', name: 'Year' },
    { value: 'title', name: 'Title' }
  ]

  const getMovies = async session => {
    try {
      setLoading(true)
      const { accessToken } = session

      filter.page = page
      filter.genre = searchByGenre

      if (sortBy === 'title' || sortBy === 'year') {
				// Sort ascending if sorting by title or year.
        filter = { ...filter, sort: `${sortBy} asc ` } 
      } else {
				filter = { ...filter, sort: `${sortBy} desc ` }
			}


      const res = await galleryApi.getMoviesList(accessToken, filter, search)

      if (res?.error) {
        throw new Error(res.error)
      }

      if (
        // search.length > 0 ||
        // searchByGenre.length > 0 ||
        showResults === true ||
        sortBy === 'title' ||
        sortBy === 'year'
      ) {
        setMovies([...res?.movies, ...movies])
      } else {
        setMovies(prevMovies => {
          return prevMovies.length === 0 ? res?.movies : [...prevMovies, ...res?.movies]
        })
      }

      // setMovies(prevMovies => {
      //   return prevMovies.length === 0 ? res?.movies : [...prevMovies, ...res?.movies]
      // })

      setHasMore(res?.hasMore)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovies(session)
  }, [session, page, showResults === true, sortBy])
  // }, [session, page, showResults === true, searchByGenre, sortBy])

  useEffect(() => {
    if (Object.values(filter).filter(v => v).length > 0 || search || searchByGenre) {
      // Reset the states to default
      setPage(1)
      setSearch('')
      setSearchByGenre('')
      setFilter({})
      setClearInput(!clearInput)
    }
  }, [clearInput])

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

  console.log('asd  len movies', movies)

  const getMovies = async session => {
    try {
      setLoading(true)
      const { accessToken } = session

      filter.page = page
      filter.genre = searchByGenre

      if (sortBy) {
        filter = { ...filter, sort: sortBy }
      }

      const res = await galleryApi.getMoviesList(accessToken, filter, search)

      if (res?.error) {
        throw new Error(res.error)
      }

      setMovies([...movies, ...res?.movies])

      setHasMore(res?.hasMore)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovies(session)
  }, [session, page, showResults === true, sortBy])
  // }, [session, page, showResults === true, searchByGenre, sortBy])

  const oldestVid = movies?.sort((a, b) => new Date(a.date_uploaded) - new Date(b.date_uploaded))[0]

  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date(oldestVid?.date_uploaded || null))
  const [endDate, setEndDate] = useState(new Date())
  const [showResults, setShowResults] = useState(false)

  const startDateMs = startDate.getTime()
  const endDateMs = endDate.getTime()

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }

  const filteredMovies = movies

  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  const isMovieDataPresent = movies?.length > 0

  // https://yts.mx/api#list_movies
  const onInputChange = val => {
    setSearch(val)
    setShowResults(false)
  }

  const onGenreInputChange = val => {
    setSearchByGenre(val)
    setShowResults(false)
  }

  const onSearch = async () => {
    setShowResults(true)

    // Then get the movies
    await getMovies(session)

    // Reset all the filter and search states
    setMovies([])
    setFilter({})
    setSearchByGenre('')
    setSortBy('')
    setPage(1)
  }

  const onGenreSearch = async () => {
    setShowResults(true)

    // Then get the movies
    await getMovies(session)

    // Reset all the filter and search states
    setMovies([])
    setFilter({})
    setSearch('')
    // setSearchByGenre('')
    setSortBy('')
    setPage(1)
  }

  const handleSortByChange = val => {
    setSortBy(val)
    // after changing the sort by, reset the page to 1
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
                onEnter={onSearch}
              />
            </div>
          </div>

          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Search By Genre</p>
            <FormInput
              isValid={searchByGenre?.length > 3}
              placeholder="Filter by Genre"
              onChange={val => onGenreInputChange(val)}
              // onChange={onGenreInputChange} // or call in a arr function
              value={searchByGenre}
              onEnter={onGenreSearch}
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
        filteredMovies={filteredMovies}
        loading={loading}
        sortBy={sortBy}
        filter={filter}
        search={search}
        searchByGenre={searchByGenre}
        showResults={showResults}
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
