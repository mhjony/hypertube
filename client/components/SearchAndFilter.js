import React, { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'

import Modal from './Modal'
import DateRange from './DateRange'
import MovieDisplay from './MovieDisplay'
import FormInput from './FormInput'

dayjs.extend(isToday)
dayjs.extend(relativeTime)

const SearchAndFilter = ({ movies }) => {
  const oldestVid = movies?.movies?.sort(
    (a, b) => new Date(a.date_uploaded) - new Date(b.date_uploaded)
  )[0]

  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date(oldestVid?.date_uploaded || null))
  const [endDate, setEndDate] = useState(new Date())
  const [search, setSearch] = useState('')
  const [searchByGenre, setSearchByGenre] = useState('')

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }

  const startDateMs = startDate.getTime()
  const endDateMs = endDate.getTime()

  const searchSplit = search.toLowerCase().split(' ')
  const filteredMovies = movies?.movies
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

  return (
    <div>
      <div className="bg-black w-full pb-4 flex items-center justify-around mb-0.5 rounded gap-4">
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
            className="inline-block px-6 py-2 border-2 border-gray-500 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
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

      <MovieDisplay filteredMovies={filteredMovies} />
    </div>
  )
}

export default SearchAndFilter
