import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import movieService from '../../services/backend/movies'

const Player = ({ subsTracks, imdbCode, movie, accessToken }) => {
	console.log(subsTracks);
  const playerRef = useRef(null)
	const streamUrl =
    // eslint-disable-next-line no-undef
		`http://localhost:8000/movie/player/${imdbCode}/${accessToken}`;	// Add a token here at the end.

  const [statusPlayer, setStatusPlayer] = useState('');
  const [error, setError] = useState(false);
  const buffering = useRef(false);

  const onClickPreview = () => {
		console.log('Clicked on preview.');
		movieService.setMovieWatched(accessToken, imdbCode)
    setStatusPlayer('buffering')
    buffering.current = true
  }

	const onReady = () => {
    buffering.current = false;
  };

  const onPlay = () => {
		console.log('Clicked on play.');
		// Send request to serve the damn stream.
    setStatusPlayer('movie.playing');
    //movieService.setWatched(imdbCode);
  };

  const onBuffer = () => {
    setStatusPlayer('movie.buffering');
    buffering.current = true;
  };

  const onBufferEnd = () => {
    setStatusPlayer('movie.playing');
    buffering.current = false;
  };

  const onPause = () => {
    setStatusPlayer('movie.paused');
  };

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

	const onProgress = ({ playedSeconds, loadedSeconds }) => {
    if (playedSeconds > loadedSeconds && !error) {
      setStatusPlayer('movie.notLoadedError');
      playerRef.current.showPreview();
    }
  };

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
					/* onBuffer={onBuffer}
					onProgress={onProgress}
					onError={onError}
					onPause={onPause}
					onReady={onReady}
					onPlay={onPlay}
					onBufferEnd={onBufferEnd}
					onClickPreview={onClickPreview} */
					config={{
						file: {
							attributes: {
								crossOrigin: 'anonymous',
							},
							tracks: subsTracks,
						},
					}}
        />
				</div> 
      </div>
  )
}

export default Player
