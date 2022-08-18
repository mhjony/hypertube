import React from 'react'

const Loader = ({ color = '#FF435D', size = '65px' }) => (
  <>
    <div className="spinner">
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    </div>

    <style jsx>{`
      .spinner {
        width: ${size};
        height: ${size};

        position: relative;
        margin: 0 auto;
      }

      .double-bounce1,
      .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${color};
        opacity: 0.3;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: sk-bounce 2s infinite ease-in-out;
        animation: sk-bounce 2s infinite ease-in-out;
      }

      .double-bounce2 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
      }

      @-webkit-keyframes sk-bounce {
        0%,
        100% {
          -webkit-transform: scale(0);
        }
        50% {
          -webkit-transform: scale(1);
        }
      }

      @keyframes sk-bounce {
        0%,
        100% {
          transform: scale(0);
          -webkit-transform: scale(0);
        }
        50% {
          transform: scale(1);
          -webkit-transform: scale(1);
        }
      }
    `}</style>
  </>
)

export default Loader
