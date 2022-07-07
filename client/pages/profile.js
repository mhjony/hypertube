import React, { useState, useMemo, useEffect } from 'react'
import Pagination from '../components/Pagination'

import api from '../services/backend/movies'

let PageSize = 10

const profile = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])

  const getMovies = async () => {
    try {
      const res = await api.getMoviesList()
      if (res?.error) {
        throw new Error(res.error)
      } else {
        setData(res)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

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
      <h>This is profile page</h>
      <p>User will be able to update their profile settings from here</p>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  )
}

export default profile
