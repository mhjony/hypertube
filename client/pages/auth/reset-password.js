/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import Router, { useRouter } from 'next/router'

import FormInput from '../../components/FormInput'

import api from '../../services/backend/resetPassword'

export default function resetPassword() {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(null)

  const router = useRouter()
  const { token } = router.query

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

    // Password complexity check (uppercase, lowercase, number, special character)
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      setPasswordConfirmationError(
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      )
      return
    }

    setLoading(true)

    try {
      await api.resetPassword(password, token)
      console.error(password)
      setLoading(false)

      Router.push('/auth/login')
    } catch (e) {
      setError('Something went wrong. Please try again!')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen bg-slate-800">
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
