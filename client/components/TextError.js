import React from "react";

import useI18n from "hooks/use-i18n";

const TextError = ({
  error = null,
  type = null,
  className = "",
  boxed = false,
}) => {
  const { t } = useI18n();

  let usedMessage = t("error.generic");
  if (error) {
    usedMessage = typeof error === "string" ? error : JSON.stringify(error);
    // At least if connection to backend errors locally, it will transform error like that
    if (usedMessage === "{}") {
      usedMessage = `${error}`;
    }
  }
  if (type === "server_error") {
    usedMessage = t("error.server_error");
  }

  if (usedMessage === "SyntaxError: Unexpected token < in JSON at position 0") {
    usedMessage = t("error.unexpectedTokenInJson");
  }

  return (
    <>
      <div
        className={`${boxed ? "box" : ""} text-red-600 text-sm ${className}`}
      >
        {usedMessage}
      </div>

      <style jsx>{`
        .beta {
          font-size: 10px;
          font-weight: 400;
          margin-left: 4px;
          position: relative;
          top: -8px;
        }
      `}</style>
    </>
  );
};

export default TextError;
