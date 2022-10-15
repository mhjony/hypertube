import React, { useState, useEffect } from 'react'
import Player from './Player'
import Comments from './Comments'
import movieService from '../../services/backend/movies.js'

const MovieInfo = ({ session, movie, user_id }) => {
	const [subsTracks, setSubsTracks] = useState([])
  const {
    title,
    description,
    director,
    actors,
    imdbRating,
    genre,
    releasedDate,
    runtime,
    imdb_code,
		subtitles
  } = movie
	console.log('Here is our movie; ', movie);

  useEffect(() => {
    setSubsTracks(buildTracks(imdb_code, subtitles))
  }, [imdb_code])
 
  const buildTracks = (imdb_code, subtitles) => {
    const subsLabels = { en: 'en', sv: 'sv', fi: 'fi', bn: 'bn' }
    // eslint-disable-next-line no-undef
    const baseUrl = 'http://localhost:8000'
		console.log(subtitles)

    const tracks = subtitles.reduce((acc, lang) => {
			console.log('lang ', lang);
			console.log('subsLabels[lang] ', subsLabels[lang]);
      acc.push({
        label: subsLabels[lang],
        kind: 'subtitles',
				src: `${baseUrl}/movie/${imdb_code}/subtitles/${lang}`,
        srcLang: lang,
				default: false,//default: true,
				mode: "showing"
      })
      return acc
    }, [])
    return tracks
  }

  return (
    <>
      {movie && (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl w-full lg:w-full">
            <div className="relative overflow-hidden shadow rounded-lg border-solid border-2 border-gray-500">
              <div className="text-white text-xl pt-4 mx-8">
                <h1 className="font-bold text-3xl my-2">{title}</h1>
                <div className="flex gap-4 mb-4">
                  <p className="text-red-400 text-sm">IMDB Rating: {imdbRating}</p>
                  <p className="text-gray-200 text-sm">{genre}</p>
                  <p className="text-gray-200 text-sm font-bold">
                    Release date: {''} {releasedDate}
                  </p>
                  <p className="text-gray-200 text-sm">{runtime} minutes</p>
                </div>
              </div>

              <Player subsTracks={subsTracks} imdbCode={movie.imdb_code} movie={movie} accessToken={session.accessToken}/>

              <div className="text-white text-xl pt-4 mx-8">
                <p className="text-gray-200 text-sm mt-2">{description}</p>
                <p className="text-gray-200 text-sm mt-2">Director: {director}</p>
                <p className="text-gray-200 text-sm mt-2">Cast: {actors}</p>
                <p className="text-gray-200 text-sm mt-2">
                  Subtitles: {movie.subtitles ? movie.subtitles : 'N/A'}
                </p>
              </div>

              <Comments session={session} user_id={user_id} imdb_code={imdb_code} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MovieInfo
