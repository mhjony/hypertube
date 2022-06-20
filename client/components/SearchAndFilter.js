import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'

import Modal from './Modal'
import DateRange from './DateRange'
import MovieDisplay from './MovieDisplay'

dayjs.extend(isToday)
dayjs.extend(relativeTime)

const SearchAndFilter = ({ movies }) => {
  const oldestVid = movies?.movies?.sort(
    (a, b) => new Date(a.date_uploaded) - new Date(b.date_uploaded)
  )[0]

  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date(oldestVid?.date_uploaded || null))
  const [endDate, setEndDate] = useState(new Date())

  const formatDate = date => {
    if (dayjs(date).isToday()) {
      return 'Today'
    }
    return date.toDateString()
  }

  const startDateMs = startDate.getTime()
  const endDateMs = endDate.getTime()

  const filteredMovies = movies?.movies
    ?.filter(video => {
      const videoUploaded = new Date(video.date_uploaded).getTime()
      const inDateRange = videoUploaded >= startDateMs && videoUploaded <= endDateMs

      return inDateRange
    })
    .sort((a, b) => new Date(b.date_uploaded) - new Date(a.date_uploaded))

  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  return (
    <div>
      <div className="bg-black pb-4 flex items-center justify-around mb-1 rounded gap-4">
        <div className="">
          <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
            <input
              type="search"
              className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search by Genre"
              aria-label="Search"
              aria-describedby="button-addon3"
            />
            <button
              className="btn inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              type="button"
              id="button-addon3"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <p className="text-md text-white uppercase">Filter By date</p>
          <button
            type="button"
            onClick={() => setDateModalOpen(true)}
            className="inline-block px-6 py-2 border-2 border-green-500 text-green-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
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
