import React, { useState } from "react";

import Loader from "./Loader";

const Button = ({
  className = "",
  size = null,
  children,
  onClick = () => {},
  onClickWithLoading = null,
  loading = false,
  loadingNew = false,
  negative = false,
  negativeLight = false,
  disabled = false,
  noHover = false,
  style,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const onClickWithInternalLoading = async (e) => {
    setInternalLoading(true);
    await onClickWithLoading(e);
    setInternalLoading(false);
  };

  const usedOnClick = async (e) => {
    if (onClickWithLoading) {
      onClickWithInternalLoading(e);
      return;
    }

    onClick(e);
  };

  const usedLoading = loading || internalLoading;

  return (
    <>
      <button
        type="button"
        className={`button ${loadingNew ? "button--loading" : ""} ${
          negative ? "button--negative" : ""
        } ${negativeLight ? "button--negative-light" : ""} ${className} ${
          noHover ? "no-hover" : ""
        } ${size ? `button--${size}` : ""}`}
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
  );
};

export default Button;
