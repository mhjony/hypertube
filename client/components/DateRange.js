import React from 'react'
import { DateRangePicker } from 'react-date-range'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRange = ({ startDate, setStartDate, setEndDate, endDate, minDate = undefined }) => {
  const handleSelect = val => {
    console.log('onselect', val)

    setStartDate(val.selection.startDate)

    const newEndDate = val.selection.endDate
    newEndDate.setHours(23)
    newEndDate.setMinutes(59)
    newEndDate.setSeconds(59)
    setEndDate(newEndDate)
  }

  const maxDate = new Date()

  const selectionRange = {
    startDate,
    endDate,
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
