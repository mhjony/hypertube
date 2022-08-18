import React from 'react'
import { DateRangePicker } from 'react-date-range'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRange = ({ startDate, setStartDate, setEndDate, endDate, minDate = undefined }) => {
  const handleSelect = val => {
    setStartDate(val.selection.startDate)
    setEndDate(val.selection.endDate)
  }

  const maxDate = new Date()

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }

  return (
    <DateRangePicker
      ranges={[selectionRange]}
      onChange={handleSelect}
      minDate={minDate}
      maxDate={maxDate}
    />
  )
}

export default DateRange
