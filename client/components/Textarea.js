/* eslint-disable max-len */
import React, { useRef, useState, memo } from 'react'

const InputTextarea = ({
  onChange = () => {},
  onEnter = () => {},
  placeholder,
  disabled = false,
  value,
  label,
  name = null,
  error = null,
  description = null,
  rows = null,
  wrap = false,
  autoSize = false
}) => {
  const inputEl = useRef(null)
  const [hasFocus, setHasFocus] = useState(false)

  const onKeyDown = e => {
    if (e.key !== 'Enter') return
    onEnter(e)
  }

  const onFocusChange = newFocus => {
    setHasFocus(newFocus)
  }

  const normalBorder = disabled ? 'border-gray-200' : 'border-gray-300'

  const onChangeEvent = e => {
    const eventValue = e.target.value
    onChange(eventValue)

    if (autoSize && document.getElementById(name)) {
      document.getElementById(name).style.height = `${document.getElementById(name).scrollHeight}px`
    }
  }

  const usedRows = rows || (value || '').split('\n').length

  return (
    <>
      <div className="relative">
        {label && (
          <label
            htmlFor={name}
            className={`label-two ${wrap ? 'whitespace-prewrap' : 'whitespace-pre'}`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={inputEl}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          name={name}
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChangeEvent}
          onKeyDown={onKeyDown}
          value={value}
          rows={usedRows}
          spellCheck="false"
          className={`px-2 py-1 relative rounded-md shadow-sm sm:text-sm ${
            hasFocus ? 'ring-indigo-500 border-indigo-500' : normalBorder
          } ${disabled ? 'bg-gray-100' : ''} border-2 rounded-md w-full ${
            error ? 'text-red-600' : 'text-black'
          }`}
        />

        {description && <p className="text-xs text-gray-700 pt-3">{description}</p>}

        {error && <div className="text-xxs text-red-600 font-bold mb-3">{error}</div>}
      </div>

      <style jsx>{`
        textarea:focus {
          outline-style: none;
        }
      `}</style>
    </>
  )
}

export default memo(InputTextarea)
