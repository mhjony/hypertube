import React from 'react'
import Player from './Player'
import Comments from './Comments'

const MovieInfo = ({ session }) => {
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
                  <span className="text-sm">
                    {['Horror', 'Action', 'Love'].map(g => g).join(', ')}
                  </span>
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

            <Player />

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

            <Comments session={session} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieInfo
