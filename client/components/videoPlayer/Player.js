import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import movieService from '../../services/backend/movies'

const Player = ({ subsTracks, imdbCode, movie, accessToken }) => {
  const playerRef = useRef(null)
	const streamUrl =
    // eslint-disable-next-line no-undef
		`http://localhost:8000/movie/player/${imdbCode}`;	// Add a token here at the end.

  const [statusPlayer, setStatusPlayer] = useState('');
  const [error, setError] = useState(false);
  const buffering = useRef(false);

  const onClickPreview = () => {
		movieService.setMovieWatched(accessToken, imdbCode)
    setStatusPlayer('buffering')
    buffering.current = true
  }

  const onError = err => {
    if (
      err &&
      err.target &&
      err.target.error &&
      (err.target.error.code === 3 || err.target.error.code === 4 || err.target.error.code === 1)
    ) {
      setStatusPlayer('sourceFileError')
      setError(true)
      playerRef.current.showPreview()
    }
  }

  useEffect(() => {
    return () => {
      if (buffering.current === false) window.location.reload()
    }
  }, [])

	const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div>
			
      <div className="flex items-center justify-center">
			
        <ReactPlayer
          className="react-player"
          ref={playerRef}
          controls={true}
          pip={false}
					light={movie.thumbnail}
					playing={true}
					playsinline={true}
					url={[
						{ src: streamUrl, type: 'video/mp4' }
					]}
          width="100%"
          onError={onError}
          onReady={onLoadedData}
          onClickPreview={onClickPreview}
					/* config={{
						file: {
							attributes: {
								crossOrigin: 'true',
							},
							tracks: subsTracks,
						},
					}} */
        />
				</div> 
      </div>
  )
}

export default Player
