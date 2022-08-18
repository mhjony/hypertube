import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import Modal from './Modal'

import apiUpdateProfile from '../services/backend/updateProfile'
import MovieInfo from './videoPlayer/MovieInfo'

const MoviePlayerModal = ({ movie }) => {
  const { data: session } = useSession()

  const userInfo = session?.user

  console.log('asd userInfo', userInfo)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    accessToken,
    user: { user_id }
  } = session

  const handleProfileUpdate = async () => {
    try {
      setLoading(true)

      // await apiUpdateProfile.updateProfile(
      //   user_id,
      //   accessToken
      // )

      setIsModalOpen(false)
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

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

            {/* <h2 className="font-bold text-xl md:text-2xl">Play Movie tile</h2>
            

            <p className="leading-normal text-gray-600 pb-4">You can update your profile here!</p> */}

            <button
              className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={handleProfileUpdate}
            >
              Play Movie
            </button>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default MoviePlayerModal
