import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import { useTranslation } from 'react-i18next'

// import img from '../../images/video-banner.png'
import img from '../../public/video-banner.png'
import movieService from '../../services/backend/movies'
import Comments from './Comments'

const Player = ({ subsTracks, imdbCode }) => {
  //   const token = localStorage.getItem('token')

  // const { t } = useTranslation()
  const playerRef = useRef(null)
  //   const streamUrl =
  //     // eslint-disable-next-line no-undef
  //     process.env.REACT_APP_BACKEND_URL + `/api/movies/${imdbCode}/play/${token}`

  const [statusPlayer, setStatusPlayer] = useState('')
  const [error, setError] = useState(false)
  const buffering = useRef(false)

  const onClickPreview = () => {
    // setStatusPlayer(t('movie.buffering'))
    setStatusPlayer('buffering')
    buffering.current = true
  }

  const onReady = () => {
    buffering.current = false
  }

  const onPlay = () => {
    // setStatusPlayer(t('movie.playing'))
    setStatusPlayer('playing')
    movieService.setWatched(imdbCode)
  }

  const onBuffer = () => {
    // setStatusPlayer(t('movie.buffering'))
    setStatusPlayer('buffering')
    buffering.current = true
  }

  const onBufferEnd = () => {
    // setStatusPlayer(t('movie.playing'))
    setStatusPlayer('playing')
    buffering.current = false
  }

  const onPause = () => {
    // setStatusPlayer(t('movie.paused'))
    setStatusPlayer('paused')
  }

  const onError = err => {
    if (
      err &&
      err.target &&
      err.target.error &&
      (err.target.error.code === 3 || err.target.error.code === 4 || err.target.error.code === 1)
    ) {
      // setStatusPlayer(t('movie.sourceFileError'))
      setStatusPlayer('sourceFileError')
      setError(true)
      playerRef.current.showPreview()
    }
  }

  const onProgress = ({ playedSeconds, loadedSeconds }) => {
    if (playedSeconds > loadedSeconds && !error) {
      // setStatusPlayer(t('movie.notLoadedError'))
      setStatusPlayer('notLoadedError')
      playerRef.current.showPreview()
    }
  }

  useEffect(() => {
    return () => {
      if (buffering.current === true) window.location.reload()
    }
  }, [])

  return (
    <div>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl w-full lg:w-full">
          <div className="relative overflow-hidden shadow rounded-lg border-solid border-2 border-gray-500">
            <div className="text-white text-xl pt-4 mx-8">
              <h1 className="font-bold text-3xl my-2">Movie Title</h1>
              <div className="flex gap-4 mb-4">
                <p className="text-red-400 text-sm">IMDB Rating: 8.5</p>
                <p className="text-gray-200 text-sm">
                  Horror, Thriller, Drama
                  {/* <span className="text-sm">
                  {['Horror', 'Action', 'Love'].map(g => g).join(', ')}
                </span> */}
                </p>
                <p className="text-gray-200 text-sm">
                  Release Date: {''}
                  <span className="font-bold">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
                <p className="text-gray-200 text-sm">143 min</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ReactPlayer
                className="react-player"
                ref={playerRef}
                controls={buffering.current === false}
                pip={false}
                // url={streamUrl}
                url="https://www.youtube.com/watch?v=oUFJJNQGwhk"
                onPlay={onPlay}
                width="100%"
                // width="50%"
                light={img}
                // playIcon={<PlayCircleFilledWhiteOutlined fontSize="large" />}
                onBuffer={onBuffer}
                onProgress={onProgress}
                onError={onError}
                onPause={onPause}
                onReady={onReady}
                onBufferEnd={onBufferEnd}
                onClickPreview={onClickPreview}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: 'true'
                    },
                    tracks: subsTracks
                  }
                }}
              />
            </div>

            <div className="text-white text-xl pt-4 mx-8">
              <p className="text-gray-200 text-sm mt-2">
                When Dawn decides to hit the road for a major music festival, she picks up a
                stranger and as the two embark, they soon find themselves being stalked and running
                for their lives as a crazed madman in a Bronco terrorizes them.
              </p>
              <p className="text-gray-200 text-sm mt-2">Director - Tasmia Rahman</p>
              <p className="text-gray-200 text-sm mt-2">Cast - Tasmia, Shakil</p>
              <p className="text-gray-200 text-sm mt-2">
                Subtitles: - English, Finnish, Swedish, Bangla
              </p>
            </div>

            <Comments />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
