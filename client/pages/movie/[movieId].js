import { useState } from 'react'
import { useSession, getSession } from 'next-auth/react'

import api from '../../services/backend/movies'

import Navbar from '../../components/Navbar'
import MoviePlayerModal from '../../components/moviePlayerModal'

const movieId = ({ movie }) => {
	console.log(movie);
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

            <div className="absolute inset-y-28 inset-x-8 md:inset-x-12 lg:inset-x-12 md:inset-y-auto md:bottom-10 space-y-6 z-50 text-gray-300 pb-12 bg-gray-600 rounded-lg border shadow-md">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pl-14 pt-4">
                {movie?.title}
              </h1>
              <div className="flex items-center space-x-3 md:space-x-5 pl-14">
                <MoviePlayerModal movie={movie} />
              </div>

              <p className="font-bold text-lg md:text-sm pl-14">
                {movie.release_date || movie.first_air_date} • {Math.floor(movie.runtime / 60)}h{' '}
                {movie?.runtime % 60}m • {movie?.genre}{' '}
              </p>
            </div>

            {/* Bg Overlay */}
            {showPlayer && (
              <div className="absolute inset-0 bg-black opacity-50 h-full w-full z-50"></div>
            )}
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
