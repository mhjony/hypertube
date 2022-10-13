import { useState } from 'react'
import { useSession, getSession } from 'next-auth/react'

import api from '../../services/backend/movies'

import { PlusIcon, XIcon, PlayIcon, UserGroupIcon } from '@heroicons/react/solid'
import ReactPlayer from 'react-player/lazy'
import Navbar from '../../components/Navbar'
import MoviePlayerModal from '../../components/moviePlayerModal'

const movieId = ({ movie }) => {
  const { data: session } = useSession()

  const [showPlayer, setShowPlayer] = useState(false)

  const imgClass = {
    // limit height to to screen height
    height: '100vh',
    // limit width to to screen width
    width: '100vw',
    // calculate the ratio of the image

    // if the image is wider than the screen, then make it fit the screen
    objectFit: 'cover',
    objectPosition: 'center'
  }

  return (
    <div>
      {session && (
        <>
          <Navbar />
          <section className="relative z-50">
            <div className="relative min-h-[calc(100vh-72px)]">
              <img src={movie?.thumbnail} alt={movie?.thumbnail} style={imgClass} />
            </div>

            <div className="absolute inset-y-28 md:inset-y-auto md:bottom-10 inset-x-4 md:inset-x-12 space-y-6 z-50 text-gray-300 pb-24">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{movie?.title}</h1>
              <div className="flex items-center space-x-3 md:space-x-5">
                <MoviePlayerModal movie={movie} />

                <div className="rounded-full border-2 border-white flex items-center justify-center w-11 h-10 cursor-pointer bg-black/60">
                  <PlusIcon className="h-6" />
                </div>

                <div className="rounded-full border-2 border-white flex items-center justify-center w-11 h-11 cursor-pointer bg-black/60">
                  <UserGroupIcon className="h-6" />
                </div>
              </div>

              <p className="font-bold text-lg md:text-sm">
                {movie.release_date || movie.first_air_date} • {Math.floor(movie.runtime / 60)}h{' '}
                {movie?.runtime % 60}m • {movie?.genre}{' '}
              </p>
              {!movie?.description == 'N/A' && movie?.description == 'N/A' && (
                <h4 className="text-sm md:text-lg max-w-4xl">{movie.description}</h4>
              )}
            </div>

            {/* Bg Overlay */}
            {showPlayer && (
              <div className="absolute inset-0 bg-black opacity-50 h-full w-full z-50"></div>
            )}

            <div
              className={`absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${
                showPlayer ? 'opacity-100 z-50' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between bg-black text-[#f9f9f9] p-3.5">
                <div
                  className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg opacity-50 hover:opacity-75 hover:bg-[#0F0F0F]"
                  onClick={() => setShowPlayer(false)}
                >
                  <XIcon className="h-5 text-red-400" />
                </div>
              </div>

              <div className="relative pt-[56.25%]">
                {/* Play Tailer */}
                {/* TODO: use movie streaming url here */}
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=zMXHYSqltmU&ab_channel=ILWYennefer`}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: '0', left: '0' }}
                  controls={true}
                  playing={showPlayer}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default movieId

export async function getServerSideProps(context) {
  const {
    params: { movieId },
    req
  } = context

  const session = await getSession({ req })

  // Call the API to get the movie details and return them as props to the page component
  const movieDetails = await api.getMovieDetails(session?.accessToken, movieId)

  return {
    props: {
      // movie: JSON.parse(JSON.stringify(movieDetails))
      movie: movieDetails
    }
  }
}
