import React, { useState } from 'react'

import Loader from './Loader'

const Button = ({
  className = '',
  children,
  onClick = () => {},
  onClickWithLoading = null,
  loading = false,
  disabled = false,
  style
}) => {
  const [internalLoading, setInternalLoading] = useState(false)

  const onClickWithInternalLoading = async e => {
    setInternalLoading(true)
    await onClickWithLoading(e)
    setInternalLoading(false)
  }

  const usedOnClick = async e => {
    if (onClickWithLoading) {
      onClickWithInternalLoading(e)
      return
    }

    onClick(e)
  }

  const usedLoading = loading || internalLoading

  return (
    <>
      <button
        type="button"
        className={
          `inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150 ${
            loading && 'opacity-25'
          } ` + className
        }
        // className={`button ${loadingNew ? 'button--loading' : ''} ${
        //   negative ? 'button--negative' : ''
        // } ${negativeLight ? 'button--negative-light' : ''} ${className} ${
        //   noHover ? 'no-hover' : ''
        // } ${size ? `button--${size}` : ''}`}
        onClick={usedOnClick}
        disabled={disabled || loading}
        style={style}
      >
        {usedLoading ? <Loader size="20px" /> : <>{children}</>}
      </button>

      <style jsx>{`
        .no-hover {
          pointer-events: none;
        }
      `}</style>
    </>
  )
}

export default Button
