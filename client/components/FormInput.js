/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { memo } from "react";

const FormInput = ({
  autocomplete = null,
  onChange,
  onClick = () => {},
  onEnter = () => {},
  isValid = false,
  placeholder,
  type,
  value,
  errorMsg,
  small = false,
  label = null,
}) => {
  const onKeyDown = (e) => {
    if (e.key !== "Enter") return;
    onEnter(e);
  };

  const onInputChange = (event) => onChange(event.target.value);

  let border = "border-gray-400 focus:border-gray-600";

  if (isValid) {
    border = "border-green-600 focus:border-green-800";
  }
  if (errorMsg) {
    border = "border-red-600 focus:border-red-800";
  }

  return (
    <>
      {label && <label className="label-two">{label}</label>}

      <input
        autoComplete={autocomplete}
        className={`input rounded-md transition-input focus:outline-0 border-2 border-solid bg-white focus:border-gray-300 placeholder-gray-500 ${
          small ? "py-1 px-2" : "py-2 px-4"
        } block w-full appearance-none leading-normal ${border}`}
        style={{ position: "relative", verticalAlign: "top" }}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        type={type || "text"}
        value={value}
        onClick={onClick}
      />
      {errorMsg && (
        <div className="mt-1 text-xs text-red-600 font-bold">{errorMsg}</div>
      )}

      <style jsx>{`
        .input {
          color: #333;
          font-size: 16px;
        }

        .input:focus {
          outline-style: none;
        }
      `}</style>
    </>
  );
};

export default memo(FormInput);
