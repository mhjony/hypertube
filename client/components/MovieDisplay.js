import React, { useState, useMemo } from 'react'

const MovieDisplay = ({ filteredMovies }) => {
  const [currentPage, setCurrentPage] = useState(1)
  console.log('Filtered Movies', filteredMovies)

  let PageSize = 10
  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    console.log('test', firstPageIndex)
    console.log('test', lastPageIndex)
    return filteredMovies?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage])

  console.log('currentPageData 01', filteredMovies?.slice(0, 10))
  console.log('currentPageData 02', currentPageData)

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {filteredMovies
          ? filteredMovies?.map(video => (
              <div>
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

                  <div className="text-sm">
                    {' '}
                    {video.title} ({video.year})
                  </div>
                  <div className="text-xs">IMBD rating: {video.rating}</div>
                </div>
              </div>
            ))
          : null}
      </div>

      {/* TODO: Pagination here */}

      <div className="pt-16 mt-8 flex justify-center items-center bg-red-400">
        <div className="font-bold pl-4 flex-grow text-xs">{`${filteredMovies?.length} videos`}</div>
        <button
          type="button"
          className="button button--xs mr-4 bg-gray-200"
          // onClick={() => gotoPage(0)}
          // disabled={!canPreviousPage}
        >
          First
        </button>
        <button
          type="button"
          className="button button--xs mr-4"
          // onClick={() => previousPage()}
          // disabled={!canPreviousPage}
        >
          Previous
        </button>
        <div className="flex flex-col justify-center items-center text-xs">
          <div className="text-gray-700 px-2 mx-8">
            Page 1 of 5
            {/* <span className="font-bold text-black">
              {pageIndex + 1} of {pageOptions.length}
            </span> */}
          </div>
        </div>
        <button
          type="button"
          className="button button--xs mr-4"
          // onClick={() => nextPage()}
          // disabled={!canNextPage}
        >
          Next
        </button>
        <button
          type="button"
          className="button button--xs ml-2"
          // onClick={() => gotoPage(pageCount - 1)}
          // disabled={!canNextPage}
        >
          Last
        </button>
        <div className="ml-2 flex-grow flex items-center justify-end pr-2">
          <select
            className="text-xs"
            // value={pageSize}
            // onChange={e => {
            //   setPageSize(Number(e.target.value))
            // }}
          >
            {/* {[20, 50, 100, 250, 500].map(_pageSize => (
              <option key={_pageSize} value={_pageSize}>
                {`${_pageSize} numbers per page`}
              </option>
            ))} */}
          </select>
        </div>
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
