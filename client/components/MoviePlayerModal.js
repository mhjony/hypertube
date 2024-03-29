import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import Modal from './Modal'

import MovieInfo from './videoPlayer/MovieInfo'

const MoviePlayerModal = ({ movie }) => {
  const { data: session } = useSession()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const user_id = session?.user_id || session?.user?.user_id

  return (
    <div className="flex flex-wrap items-start mb-4">
      <div className="mr-5">
        <div
          onClick={() => setIsModalOpen(true)}
          className="text-xs md:text-base bg-[#f9f9f9] text-black flex items-center justify-center py-4 px-6 rounded hover:bg-[#c6c6c6]"
        >
          <div className="uppercase text-xs text-gray-600">Play Movie</div>
        </div>

        {isModalOpen && (
          <Modal center isOpen={isModalOpen} close={() => setIsModalOpen(false)} minWidth={450}>
            <MovieInfo session={session} movie={movie} user_id={user_id} />
          </Modal>
        )}
      </div>
    </div>
  )
}

export default MoviePlayerModal
