import React, { useState, useMemo } from 'react'
import Button from './Button'

const MovieDisplay = ({ filteredMovies }) => {
  const [page, setPage] = useState(0)

  console.log('Filtered Movies', filteredMovies)

  let PER_PAGE = 10

  const limitStart = page * PER_PAGE
  const limitEnd = (page + 1) * PER_PAGE

  const totalPages = Math.ceil(filteredMovies?.length / PER_PAGE)

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {filteredMovies
          ? filteredMovies?.slice(limitStart, limitEnd)?.map(video => (
              <div className="video" key={video.id}>
                <div className="video--img">
                  <img src={video.thumbnail} alt={video.title}></img>
                </div>

                {/* Video Info */}
                <div className="video-overlay">
                  <div className="video--info">
                    <div className="flex items-center mb-1 md:mb-2">
                      <div className="video--icon"></div>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-bold text-gray-200">
                  {' '}
                  {video.title} ({video.year})
                </div>
                <div className="text-xs text-gray-200 font-light">IMBD rating: {video.rating}</div>
              </div>
            ))
          : null}
      </div>

      {/* Pagination Part */}
      <div className="flex justify-center items-center mt-16">
        <Button
          onClick={() => {
            setPage(page - 1)
          }}
          className="bg-red-500 font-bold"
          disabled={page === 0}
        >
          {'<'}
        </Button>
        <div className="px-3 text-gray-200 text-md">{`Page ${page + 1} / ${totalPages}`}</div>
        <Button
          onClick={() => {
            setPage(page + 1)
          }}
          className="bg-red-500 font-bold"
          disabled={filteredMovies?.length < limitEnd ? true : false}
        >
          {'>'}
        </Button>
      </div>

      <style jsx>{`
        .video,
        .video--img,
        .video--title,
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
        .video.video--small {
          height: 300px;
        }
        .video.video--large {
          height: 650px;
        }
        .video:hover {
          transform: scale3d(0.98, 0.98, 0.98);
        }
        .video-overlay {
          background: rgb(240, 148, 51);
          background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
          position: relative;
          z-index: 4;
          width: 100%;
          height: 100%;
        }
        .video--icon {
          margin-right: 4px;
          text-align: center;
          width: 18px;
        }
        .video--info {
          color: #fff;
          left: 20px;
          padding: 10px;
          position: absolute;
          top: 0;
          width: 100%;
          font-weight: 600;
          font-size: 24px;
          line-height: 14px;
          vertical-align: middle;
          color: #fff;
        }
        .video--small .video--info {
          font-size: 14px;
        }
        .video--title {
          background: rgba(0, 0, 0, 0.4);
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0) 100%
          );
          color: #fff;
          bottom: 0;
          font-size: 16px;
          font-weight: 400;
          left: 0;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 10;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: 15px 10px 10px;
          position: absolute;
          word-break: break-word;
          width: 100%;
        }
        .video--date {
          font-size: 100%;
          margin-bottom: 5px;
        }
        .video--small .video--title {
          font-size: 12px;
        }
        @media (max-width: 767px) {
          .video {
            margin-bottom: 0px;
          }
          .video--small .video--info,
          .video--small .video--title {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default MovieDisplay
