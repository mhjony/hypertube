import React, { memo } from 'react'

/* eslint-disable-next-line max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
const Modal = ({ children, isOpen, close, maxWidth = null, minHeight = 300, minWidth = 300 }) => (
  <>
    <div className={`modal-container ${isOpen ? 'modal-container--open' : ''}`} onClick={close}>
      <div
        className="modal-content"
        onClick={e => {
          // https://stackoverflow.com/questions/37568550/react-prevent-event-trigger-on-parent-from-child
          e.stopPropagation()
        }}
      >
        <svg
          className="modal-close fill-current w-5 h-5 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          onClick={close}
        >
          <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
        </svg>
        <div className="modal-children">{children}</div>
      </div>
    </div>

    <style jsx>{`
      .modal-container {
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        bottom: 0;
        cursor: pointer;
        display: none;
        justify-content: center;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1100;
      }
      .modal-container.modal-container--open {
        display: flex;
      }

      .modal-close {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .modal-content {
        background: #fff;
        border-radius: 5px;
        cursor: default;
        max-height: 90vh;
        min-height: ${minHeight}px;
        max-width: ${maxWidth ? `${maxWidth}px` : '80%'};
        // min-width: 300px;
        min-width: ${minWidth}px;
        overflow: scroll;
        position: relative;
        z-index: 10;
      }

      .modal-content::-webkit-scrollbar {
        display: none;
      }

      .modal-children {
        min-height: ${minHeight}px;
        padding: 15px 20px;
        width: 100%;
      }

      @media (max-width: 600px) {
        .modal-children {
          max-height: 90vh;
        }
        .modal-content {
          max-width: 95%;
          min-width: 300px;
        }
      }
    `}</style>
  </>
)

export default memo(Modal)
