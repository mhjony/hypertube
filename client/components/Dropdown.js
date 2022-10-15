/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

import Loader from './Loader'

const Dropdown = ({
  disabled = false,
  autocomplete = null,
  label = null,
  options,
  onChange,
  withEmpty = false,
  loading = false,
  selected = null,
  width = 'none',
  forceWithoutEmpty = false,
  className = ''
}) => {
  const showEmpty = withEmpty || (!selected && selected !== 0)

  return (
    <div className={`${className} relative`}>
      {label && <label className="label-two text-white uppercase">{label}</label>}

      <select
        autoComplete={autocomplete}
        value={selected}
        disabled={disabled}
        className="rounded-md transition focus:outline-0 border border-solid border-gray-300 hover:border-gray-500 focus:border-gray-600 bg-white placeholder-gray-500 py-2 pl-2 pr-6 block w-full leading-normal text-sm"
        onChange={event => onChange(event.target.value)}
        style={{ maxWidth: width }}
      >
        {showEmpty && !forceWithoutEmpty && <option key="">&nbsp;</option>}
        {options.map((option, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <option key={`${option.value}-${i}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>

      {loading && (
        <div className="absolute" style={{ right: '5px', top: '10px' }}>
          <Loader size="20px" />
        </div>
      )}
    </div>
  )
}

export default Dropdown
