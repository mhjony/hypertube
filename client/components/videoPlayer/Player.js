import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
// import { useTranslation } from 'react-i18next'

import img from '../../public/video-banner.png'
import movieService from '../../services/backend/movies'

const Player = ({ subsTracks, imdbCode }) => {
  //   const token = localStorage.getItem('token')

  // const { t } = useTranslation()
  const playerRef = useRef(null)

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
    </div>
  )
}

export default Player
