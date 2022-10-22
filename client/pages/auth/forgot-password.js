import React, { useState } from 'react'
import Link from 'next/link'

import api from '../../services/backend/forgotPassword'

import FormInput from '../../components/FormInput'

const forgotPassword = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
	setEmailError(null)

	 if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
	 {
	 	setEmailError('Please enter a valid email')
	 	return
	 }

    try {
      const apiResponsee = await api.forgotPassword(email)

	  if (apiResponsee === "This email address doesn't match with any account! Check & Try again!")
	  {
		setEmailError("This email address doesn't match with any account! Check & Try again!")
	  }

	  if (apiResponsee === "Account is not activated yet, please check your email!")
	  {
		setEmailError("Account is not activated yet, please check your email!")
	  }

	  if (apiResponsee.sucess === true)
	  {
		setSuccessMessage(true)
	  }
    } catch (error) {
		setEmailError("Something went wrong. Please try again!")
    }
  }

  const hasEmptyField = email.length === 0

  const Message = () => (
    <div className="text-green-600 text-sm mt-2 mb-2">
      We've sent an email to {email} with a link to get back into your account.
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-800">
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
              errorMsg={emailError}
            />
          </div>

          <button
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={onSubmit}
            disabled={hasEmptyField}
          >
            Send Login Link
          </button>

          {successMessage ? <Message /> : null}
        </form>

        <hr className="my-4" />

        <div className="flex items-center justify-center mb-2">
          <div className="text-xs sm:text-sm">
            Back to Login
            <Link href="/auth/login">
              <a className="font-bold border-b-2 border-solid border-gray-300"> Login</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default forgotPassword
