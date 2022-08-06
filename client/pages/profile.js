import React from 'react'
import { useSession } from 'next-auth/react'

// import Player from '../components/videoPlayer/Player'
import MovieInfo from '../components/videoPlayer/MovieInfo'

const profile = () => {
  const { data: session } = useSession()

  return (
    <>
      {/* <Player /> */}
      <MovieInfo session={session} />
    </>
  )
}

export default profile
