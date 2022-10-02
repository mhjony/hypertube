import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
//import the damn play icon from react icon
// import { useTranslation } from 'react-i18next'

import img from '../../public/video-banner.png'
import movieService from '../../services/backend/movies'

const Player = ({ subsTracks, imdbCode }) => {
  //   const token = localStorage.getItem('token')

  // const { t } = useTranslation()
  const playerRef = useRef(null)
	const streamUrl =
    // eslint-disable-next-line no-undef
		`http://localhost:8000/movie/player/tt0111161`;

	const [filestream, setFilestream] = useState();
	

  const [statusPlayer, setStatusPlayer] = useState('')
  const [error, setError] = useState(false)
  const buffering = useRef(false)

  const onClickPreview = () => {
    // setStatusPlayer(t('movie.buffering'))
		console.log('onClickPreview');
		console.log(streamUrl);
    setStatusPlayer('buffering')
    buffering.current = true
  }

  const onReady = () => {
		console.log('onReady');
    buffering.current = false
  }

  const onPlay = () => {
    // setStatusPlayer(t('movie.playing'))
		console.log('onPlay');
    setStatusPlayer('playing')
    //movieService.setWatched(imdbCode)
  }

  const onBuffer = () => {
    // setStatusPlayer(t('movie.buffering'))
		console.log('onBuffer');
    setStatusPlayer('buffering')
    buffering.current = true
  }

  const onBufferEnd = () => {
    // setStatusPlayer(t('movie.playing'))
		console.log('onBufferEnd');
    setStatusPlayer('playing')
    buffering.current = false
  }

  const onPause = () => {
		console.log('onPause');
    // setStatusPlayer(t('movie.paused'))
    setStatusPlayer('paused')
  }

  const onError = err => {
		console.log(err);
		console.log(filestream);
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
      if (buffering.current === false) window.location.reload()
    }
  }, [])

	/* const getStream = async () => {
    try {
      //setLoading(true)
      //const { accessToken } = session

      const data = await movieService.getFileStream('')

      if (data?.error) {
        throw new Error(res.error)
      } else {
        setFilestream(data)
        //setLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getStream()
  }, []) */

  return (
    <div>
      <div className="flex items-center justify-center">
			{/* <video id="videoPlayer" controls>
				<source src="http://localhost:8000/movie/player/tt0111161" type="video/mp4"/>
			</video> */}
        <ReactPlayer
          className="react-player"
          ref={playerRef}
          controls={buffering.current === false}
          pip={false}
          //url='http://localhost:8000/movie/player/tt0111161'
					//url='http://localhost:8000/movie/player/tt0111161'
					url={[
						{ src: 'http://localhost:8000/movie/player/tt0111161', type: 'video/mp4' }
					]}
          //url="https://filesamples.com/samples/video/ogv/sample_640x360.ogv"
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
              }/*,
              tracks: subsTracks*/
            }
          }}
        />
      </div>
    </div>
  )
}

export default Player
