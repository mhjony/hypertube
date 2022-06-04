/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { getSession, signIn, getCsrfToken, getProviders } from 'next-auth/react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import FormInput from '../../components/FormInput'

import api from '../../services/backend/user'

export default function resetPassword({ enabledProviders, csrfToken }) {
  const [password, setPassword] = useState('Odvhut93')
  const [passwordConfirmation, setPasswordConfirmation] = useState('Odvhut93')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(null)

  const onSubmit = async event => {
    event.preventDefault()

    setPasswordConfirmationError(null)

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setPasswordConfirmationError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const signupResponse = await api.resetPassword(password)

      if (signupResponse.message === 'User account created successfully') {
        notify()
      }

      Router.push('/auth/login')
    } catch (e) {
      setError('An error occured while registering. Please try again.')
    }

    setLoading(false)
  }

  const disabled = password.length === 0 || passwordConfirmation.length === 0

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h className="font-bold text-xl md:text-xl flex justify-center">Create a strong password</h>
        <p className="text-gray-400 mb-8 flex justify-center">
          Your password must be at least six characters and should include a combination of numbers,
          letters.
        </p>

        <div className="mb-6 md:mb-8">
          <div className="mb-4">
            <FormInput
              label="NEW PASSWORD"
              placeholder="New Password"
              onChange={setPassword}
              value={password}
              type="password"
              autocomplete="new-password"
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="RE-ENTER NEW PASSWORD"
              placeholder="Confirm New Password"
              onChange={value => {
                setPasswordConfirmationError(null)
                setPasswordConfirmation(value)
              }}
              value={passwordConfirmation}
              errorMsg={passwordConfirmationError}
              type="password"
              autocomplete="new-password"
            />
          </div>

          <button
            className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={onSubmit}
          >
            Reset password
          </button>
        </div>
      </div>
    </div>
  )
}
