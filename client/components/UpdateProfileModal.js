import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import Modal from './Modal'
import FormInput from './FormInput'

import apiUpdateProfile from '../services/backend/updateProfile'

const InternalNotesModal = () => {
  const { data: session } = useSession()

  const userInfo = session?.user
  console.log('asd userInfo', userInfo)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [firstname, setFirstname] = useState(userInfo?.first_name)
  // const [lastname, setLastname] = useState(userInfo?.last_name)
  // const [username, setUsername] = useState(userInfo?.user_name)
  // const [email, setEmail] = useState(userInfo?.email)

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const user_id = session?.user.user_id
  const newEmail = 'hivehelsinki@gmail.com'

  const handleProfileUpdate = async () => {
    try {
      console.log('I am handleProfileUpdate 01')
      setLoading(true)

      await apiUpdateProfile.updateProfile(
        user_id,
        email,
        newEmail,
        firstname,
        lastname,
        username,
        email
      )
      console.log('I am handleProfileUpdate 04')

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
          className="px-4 py-2 mt-4 rounded bg-red-200 cursor-pointer"
        >
          <div className="uppercase text-xs text-gray-600">Profile</div>
        </div>

        {isModalOpen && (
          <Modal center isOpen={isModalOpen} close={() => setIsModalOpen(false)} minWidth={450}>
            <h2 className="font-bold text-xl md:text-2xl">Profile</h2>

            <p className="leading-normal text-gray-600 pb-4">You can update your profile here!</p>
            <form onSubmit={handleProfileUpdate} className="mb-6 md:mb-8">
              <div className="mb-4">
                <FormInput
                  label="FIRST NAME"
                  placeholder="FirstName"
                  onChange={setFirstname}
                  value={firstname}
                  autocomplete="FirstName"
                />
              </div>
              <div className="mb-4">
                <FormInput
                  label="LAST NAME"
                  placeholder="LastName"
                  onChange={setLastname}
                  value={lastname}
                  autocomplete="LastName"
                />
              </div>
              <div className="mb-4">
                <FormInput
                  label="USERNAME"
                  placeholder="Username"
                  onChange={setUsername}
                  value={username}
                  autocomplete="username"
                />
              </div>
              <div className="mb-4">
                <FormInput
                  label="EMAIL"
                  placeholder="Email"
                  onChange={setEmail}
                  value={email}
                  autocomplete="Email"
                />
              </div>
            </form>

            <button
              className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
              onClick={handleProfileUpdate}
            >
              Update
            </button>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default InternalNotesModal
