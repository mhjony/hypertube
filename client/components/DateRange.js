import React from 'react'
import { DateRangePicker } from 'react-date-range'
import { isSameDay } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const defineds = {
  startOf1970: new Date(`${new Date('1970-01-01').getFullYear()}-01-01`),
  endOf1980: new Date(`${new Date('1980-12-31').getFullYear()}-12-31`),

  startOf1980: new Date(`${new Date('1980-01-01').getFullYear()}-01-01`),
  endOf1990: new Date(`${new Date('1990-12-31').getFullYear()}-12-31`),

  startOf1990: new Date(`${new Date('1990-01-01').getFullYear()}-01-01`),
  endOf2000: new Date(`${new Date('2000-12-31').getFullYear()}-12-31`),

  startOf2000: new Date(`${new Date('2000-01-01').getFullYear()}-01-01`),
  endOf2010: new Date(`${new Date('2010-12-31').getFullYear()}-12-31`),

  startOf2010: new Date(`${new Date('2010-01-01').getFullYear()}-01-01`),
  endOf2020: new Date(`${new Date('2020-12-31').getFullYear()}-12-31`),

  startOf2021: new Date(`${new Date('2021-01-01').getFullYear()}-01-01`),
  endOf2021: new Date(`${new Date('2021-12-31').getFullYear()}-12-31`),

  startOfYear: new Date(`${new Date().getFullYear()}-01-01`),
  endOfYear: new Date(`${new Date().getFullYear()}-12-31`)
}

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range()
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    )
  }
}

const createStaticRanges = ranges => ranges.map(range => ({ ...staticRangeHandler, ...range }))

const defaultStaticRanges = createStaticRanges([
  {
    label: `Year (${defineds.startOf1970.getFullYear()} - ${defineds.endOf1980.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf1970,
      endDate: defineds.endOf1980
    })
  },
  {
    label: `Year (${defineds.startOf1980.getFullYear()} - ${defineds.endOf1990.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf1980,
      endDate: defineds.endOf1990
    })
  },
  {
    label: `Year (${defineds.startOf1990.getFullYear()} - ${defineds.endOf2000.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf1990,
      endDate: defineds.endOf2000
    })
  },
  {
    label: `Year (${defineds.startOf2000.getFullYear()} - ${defineds.endOf2010.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf2000,
      endDate: defineds.endOf2010
    })
  },
  {
    label: `Year (${defineds.startOf2010.getFullYear()} - ${defineds.endOf2020.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf2010,
      endDate: defineds.endOf2020
    })
  },
  {
    label: `Last Year (${defineds.startOf2021.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOf2021,
      endDate: defineds.endOf2021
    })
  },
  {
    label: `This Year (${defineds.startOfYear.getFullYear()})`,
    range: () => ({
      startDate: defineds.startOfYear,
      endDate: defineds.endOfYear
    })
  }
])

const DateRangeComponent = ({
  startDate,
  setStartDate,
  setEndDate,
  endDate,
  minDate = undefined
}) => {
  const handleSelect = val => {
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
      staticRanges={defaultStaticRanges}
    />
  )
}

export default DateRangeComponent
