import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'

dayjs.extend(isToday)
dayjs.extend(relativeTime)

const MovieDisplay = ({ filteredMovies, sortBy, startDate, endDate, dateModalOpen }) => {
  const handleMovieDetails = movie => {
    const movieId = movie?.imdb_code

    window.location.href = `/movie/${movieId}`
  }

  let movies
  if (filteredMovies?.length > 0) {
    if (sortBy === 'rating desc') {
      movies = filteredMovies?.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'rating asc') {
      movies = filteredMovies?.sort((a, b) => a.rating - b.rating)
    } else if (sortBy === 'year desc') {
      movies = filteredMovies?.sort((a, b) => b.year - a.year)
    } else if (sortBy === 'year asc') {
      movies = filteredMovies?.sort((a, b) => a.year - b.year)
    } else if (sortBy === 'title desc') {
      movies = filteredMovies?.sort((a, b) => {
        if (a.title < b.title) {
          return 1
        }
        if (a.title > b.title) {
          return -1
        }
        return 0
      })
    } else if (sortBy === 'title asc') {
      movies = filteredMovies?.sort((a, b) => {
        if (a.title < b.title) {
          return -1
        }
        if (a.title > b.title) {
          return 1
        }
        return 0
      })
    } else {
      movies = filteredMovies
    }
  }

  // Check if dateModalOpen is true then filter movies by date
  if (dateModalOpen) {
    movies = movies?.filter(movie => {
      const movieProductionYear = new Date(movie.year).getTime()

      // get the year from startDate and endDate
      const startDateYear = new Date(startDate).getFullYear()
      const endDateYear = new Date(endDate).getFullYear()

      const inDateRange = movieProductionYear >= startDateYear && movieProductionYear <= endDateYear

      return inDateRange
    })
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {movies &&
          movies?.map((video, index) => (
            <div className="mt-8 video" key={index} onClick={() => handleMovieDetails(video)}>
              <div className="video--img">
                <img src={video.thumbnail} alt={video.title}></img>
              </div>
              <div className="video-overlay"></div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-200">
                    {' '}
                    {video.title} ({video.year})
                  </div>
                  <div className="text-xs text-gray-200 font-light">
                    IMBD rating: {video.rating}
                  </div>
                </div>

                <div className="text-xs text-gray-200 font-light mt-1">
                  {video?.movies_watched && (
                    <button className="bg-red-500 text-white rounded px-2 py-1">Watched</button>
                  )}
                </div>
              </div>
            </div>
          ))}

        {movies &&
          movies?.map((video, index) => (
            <div className="mt-8 video" key={index} onClick={() => handleMovieDetails(video)}>
              <div className="video--img">
                <img src={video.thumbnail} alt={video.title}></img>
              </div>
              <div className="video-overlay"></div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-bold text-gray-200">
                    {' '}
                    {video.title} ({video.year})
                  </div>
                  <div className="text-xs text-gray-200 font-light">
                    IMBD rating: {video.rating}
                  </div>
                </div>

                <div className="text-xs text-gray-200 font-light mt-1">
                  {video?.movies_watched && (
                    <button className="bg-red-500 text-white rounded px-2 py-1">Watched</button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      <style jsx>{`
        .video,
        .video--img,
        .video-overlay {
          border-radius: 4px;
        }
        .video {
          background-color: #000;
          background-size: cover;
          border: 0;
          display: block;
          position: relative;
          min-width: 140px;
          width: 300px;
          height: 450px;
          text-shadow: 0px 0px 12px rgba(0, 0, 0, 1), 0px 0px 12px rgba(0, 0, 0, 1);
          transform: scale3d(1, 1, 1);
          transition: all 0.2s ease-in-out;
          margin-bottom: 20px;
          background-repeat: no-repeat;
          background-position: center;
        }
        .video--img {
          height: 100%;
          width: 100%;
          left: 0;
          overflow: hidden;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 2;
        }
        .video--img img {
          height: 100%;
        }

        .video:hover {
          transform: scale3d(0.98, 0.98, 0.98);
          cursor: pointer;
        }
        .video-overlay {
          background: rgb(240, 148, 51);
          background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
          position: relative;
          z-index: 4;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 767px) {
          .video {
            margin-bottom: 0px;
          }
        }
      `}</style>
    </div>
  )
}

export default MovieDisplay
