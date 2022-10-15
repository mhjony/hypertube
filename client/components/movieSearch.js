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
  const [sortBy, setSortBy] = useState('rating')

  const sortByOptions = [
    { value: 'rating', name: 'Rating' },
    { value: 'date_uploaded', name: 'Date Uploaded' },
    { value: 'year', name: 'Year' },
    { value: 'title', name: 'Title' }
  ]

  const getMovies = async session => {
    try {
      setLoading(true)
      const { accessToken } = session

      filter.page = page
      filter.genre = searchByGenre

      const res = await galleryApi.getMoviesList(accessToken, filter, search)

      if (res?.error) {
        throw new Error(res.error)
      }

      if (search.length > 0 || searchByGenre.length > 0) {
        setMovies(res?.movies)
      } else {
        setMovies(prevMovies => {
          return prevMovies.length === 0 ? res?.movies : [...prevMovies, ...res?.movies]
        })
      }

      setHasMore(res?.hasMore)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovies(session)
  }, [session, page, search, searchByGenre])

  useEffect(() => {
    if (Object.values(filter).filter(v => v).length > 0 || search || searchByGenre) {
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

  const oldestVid = movies?.sort((a, b) => new Date(a.date_uploaded) - new Date(b.date_uploaded))[0]

  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date(oldestVid?.date_uploaded || null))
  const [endDate, setEndDate] = useState(new Date())

  const startDateMs = startDate.getTime()
  const endDateMs = endDate.getTime()

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }

  // const searchSplit = search.toLowerCase().split(' ')
  const filteredMovies = movies.filter(movie => {
    /*
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
    */

    // Filter By production year
    // let matchesProductionYear = true
    // if (startYear && endYear) {
    //   matchesProductionYear = movie.year >= startYear && movie.year <= endYear
    // }

    // Filter by upload date
    const videoUploaded = new Date(movie?.date_uploaded).getTime()
    const inDateRange = videoUploaded >= startDateMs && videoUploaded <= endDateMs
    // return matchesSearchFilter && movieByGenre && inDateRange
    return inDateRange
  })

  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  const isMovieDataPresent = movies?.length > 0

  // https://yts.mx/api#list_movies

  return (
    <div>
      {session && isMovieDataPresent ? (
        <div className="bg-slate-800 w-full pb-4 flex items-center justify-around mb-0.5 rounded gap-4">
          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Search By name or Actor</p>
            <FormInput
              isValid={search?.length > 0}
              placeholder="Search by Name"
              onChange={val => setSearch(val)}
              value={search}
            />
          </div>

          <div className="mr-4 w-full md:w-1/6">
            <p className="text-white uppercase text-md pt-2">Filter OR Search By Genre</p>
            <FormInput
              isValid={searchByGenre?.length > 0}
              placeholder="Filter by Genre"
              onChange={val => setSearchByGenre(val)}
              value={searchByGenre}
            />
          </div>

          <div className="mr-4 w-full md:w-1/6 mt-6">
            <Dropdown
              label="SORT BY"
              options={sortByOptions}
              selected={sortBy}
              onChange={setSortBy}
              width={210}
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
      ) : null}

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
