import React, { useState } from 'react'

const MovieDisplay = ({ filteredMovies, loading }) => {
  const handleMovieDetails = movie => {
    const movieId = movie?.imdb_code

    window.location.href = `/movie/${movieId}`
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {filteredMovies &&
          filteredMovies?.map(video => (
            <div className="mt-8 video" key={video.id} onClick={() => handleMovieDetails(video)}>
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
