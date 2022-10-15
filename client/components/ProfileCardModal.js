import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import Modal from './Modal'

const ProfileModal = ({ comment }) => {
  const { data: session } = useSession()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-start mb-4">
      <div className="mr-5">
        <div
          onClick={() => setIsModalOpen(true)}
          className=" rounded hover:bg-gray-200 cursor-pointer"
        >
          <a>
            <div className="px-4 py-2 mt-4 flex items-center justify-start">
              <img
                src={comment?.user?.avatar}
                alt="user-avatar"
                className="h-10 w-10 rounded-full"
              />

              <div className="hidden md:flex flex-col justify-start items-start break-all leading-snug pl-2">
                <div className="text-sm font-bold">{comment.user.user_name}</div>
              </div>
            </div>
          </a>
        </div>

        {isModalOpen && (
          <Modal
            center
            isOpen={isModalOpen}
            close={() => setIsModalOpen(false)}
            minWidth={450}
            minHeight={400}
          >
            <div>
              <div className="text-center font-bold py-4 text-xl">
                Profile of {comment?.user?.user_name}
              </div>

              {session && (
                <div className="flex justify-center items-center">
                  <div className="w-48 h-64 rounded-xl bg-gray-200 flex flex-col shadow">
                    <img className="w-auto rounded-t-xl" src={comment?.user?.avatar} alt="avatar" />
                    <div className="text-center flex flex-col p-2">
                      <span className="text-base font-bold">
                        {comment?.user.first_name} {comment?.user.last_name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default ProfileModal
