import React, { useState, useMemo, useEffect } from 'react'
import Pagination from '../components/Pagination'
import Player from '../components/videoPlayer/Player'
import Comments from '../components/videoPlayer/Comments'

import api from '../services/backend/movies'

let PageSize = 10

const profile = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    // return data?.movies?.slice(firstPageIndex, lastPageIndex)
    // get the current page data from data array
    console.log('firstPageIndex', firstPageIndex)
    console.log('lastPageIndex', lastPageIndex)
    console.log('data', data)
    return data?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage])

  console.log('currentTableData', currentTableData)

  return (
    <div>
      <Player />

      {/* <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      /> */}
    </div>
  )
}

export default profile
