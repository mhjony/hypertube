import React, { useState } from 'react'
import { signIn, useSession, getProviders } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

const forgotPassword = () => {
  const { query } = useRouter()
  const { data: session } = useSession()

  const [email, setEmail] = useState('admin@gmail.com')
  const [successMessage, setSuccessMessage] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    setSuccessMessage(true)
    // will send an email to the user with a link to reset password
  }

  const hasEmptyField = email.length === 0

  const Results = () => (
    <div className="text-green-600 text-sm mt-2 mb-2">
      We've sent an email to {email} with a link to get back into your account.
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form onSubmit={onSubmit} className="mb-6 md:mb-8">
          <h1 className="font-bold text-xl md:text-2xl mb-4">Hypertube</h1>

          <div className="mb-4">
            <FormInput
              label="Email"
              placeholder="Email"
              onChange={setEmail}
              value={email}
              autocomplete="email"
            />
          </div>

          <button
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={onSubmit}
          >
            Send Login Link
          </button>

          {successMessage ? <Results /> : null}
        </form>

        <hr className="my-4" />

        <div className="flex items-center justify-center mb-2">
          <div className="text-xs sm:text-sm">
            Back to Login
            <Link href="/auth/register">
              <a className="font-bold border-b-2 border-solid border-gray-300"> Login</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default forgotPassword
