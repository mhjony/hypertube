import { useEffect, useState } from 'react'
import { useSession, getSession } from 'next-auth/react'

import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// import Header from '../../components/Header'
// import Hero from '../../components/Hero'
import { PlusIcon, XIcon, PlayIcon, UserGroupIcon } from '@heroicons/react/solid'
import ReactPlayer from 'react-player/lazy'
import Navbar from '../../components/Navbar'

const movieId = ({ movie }) => {
  const { data: session } = useSession()

  const router = useRouter()
  const [showPlayer, setShowPlayer] = useState(false)

  console.log('session in single Movie Page ', session)
  console.log('movie', movie)

  // useEffect(() => {
  //   if (!session) {
  //     router.push('/')
  //   }
  // }, [session])

  return (
    <div>
      {/* <Head>
        <title>{movie.name}</title>
      </Head> */}
      {session ? (
        <>
          {/* TODO: Add the NavBar here */}
          <Navbar />
          <section className="relative z-50">
            <div className="relative min-h-[calc(100vh-72px)]">
              {/* <img src={movie.image.original} alt={movie.image.original} /> */}
              {/* <Image src={movie.image.original} layout="fill" objectFit="cover" /> */}
            </div>

            <div className="absolute inset-y-28 md:inset-y-auto md:bottom-10 inset-x-4 md:inset-x-12 space-y-6 z-50">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{movie.name}</h1>
              <div className="flex items-center space-x-3 md:space-x-5">
                <button
                  className="text-xs md:text-base bg-[#f9f9f9] text-black flex items-center justify-center py-2.5 px-6 rounded hover:bg-[#c6c6c6]"
                  onClick={() => setShowPlayer(true)}
                >
                  <PlayIcon className="h-6 md:h-8" />
                  <span className="uppercase font-medium tracking-wide">Play</span>
                </button>

                <button
                  className="text-xs md:text-base bg-black/30 text-[#f9f9f9] border border-[#f9f9f9] flex items-center justify-center py-2.5 px-6 rounded hover:bg-[#c6c6c6]"
                  onClick={() => setShowPlayer(true)}
                >
                  <PlayIcon className="h-6 md:h-8 text-white" />

                  <span className="uppercase font-medium tracking-wide">Trailer</span>
                </button>

                <div className="rounded-full border-2 border-white flex items-center justify-center w-11 h-11 cursor-pointer bg-black/60">
                  <PlusIcon className="h-6" />
                </div>

                <div className="rounded-full border-2 border-white flex items-center justify-center w-11 h-11 cursor-pointer bg-black/60">
                  <UserGroupIcon className="h-6" />
                </div>
              </div>

              <p className="text-xs md:text-sm">
                {movie.release_date || movie.first_air_date} • {Math.floor(movie.runtime / 60)}h{' '}
                {movie.runtime % 60}m • {movie.genres.map(genre => genre + ' ')}{' '}
              </p>
              <h4 className="text-sm md:text-lg max-w-4xl">{movie.summary}</h4>
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
                <span className="font-semibold">Play Trailer</span>
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
      ) : (
        <div>Redirect to login page</div>
      )}
    </div>
  )
}

export default movieId

export async function getServerSideProps(context) {
  const {
    params: { movieId }
    // req
  } = context

  //   const session = await getSession({ req })

  // TODO: Replace this with a real API call what we have from the server
  // TODO: we have a api called getSingleMovie that returns the movie details, so use it here
  const movieDetails = await fetch(`https://api.tvmaze.com/shows/${movieId}`).then(response =>
    response.json()
  )

  return {
    props: {
      //   session,
      movie: movieDetails
    }
  }
}
