/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { getSession, signIn, getCsrfToken, getProviders } from 'next-auth/react'

import FormInput from '../../components/FormInput'
import AuthProviderButtons from '../../components/AuthProviderButton'

import api from '../../services/backend/user'

export default function Register({ providers, csrfToken }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(null)
  const [isChecked, setIsChecked] = useState(false)

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
      const signupResponse = await api.signup(firstName, lastName, username, email, password)

      if (signupResponse.message === 'User account created successfully') {
      }

      Router.push('/auth/login')
    } catch (e) {
      console.log('Registration Error:', e)
      setError('An error occured while registering. Please try again.')
    }

    setLoading(false)
  }

  const disabled =
    password.length === 0 || passwordConfirmation.length === 0 || email.length === 0 || !isChecked

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full  bg-gradient-to-r from-red-400 to-red-800">
      <div className="shadow-lg rounded-lg bg-white border-0 px-14 pt-6 pb-8 mb-4 flex flex-col">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Register</h2>

        <form onSubmit={onSubmit} className="mb-2 md:mb-4 pt-6">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <div className="mb-4">
            <FormInput
              label="FIRST NAME"
              placeholder="Firstname"
              autocomplete="firstName"
              onChange={value => setFirstName(value)}
              value={firstName}
              errorMsg={error}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="LAST NAME"
              placeholder="Lastname"
              autocomplete="lastName"
              onChange={value => setLastName(value)}
              value={lastName}
              errorMsg={error}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="USERNAME"
              placeholder="Username"
              autocomplete="username"
              onChange={value => setUsername(value)}
              value={username}
              errorMsg={error}
            />
          </div>
          <div className="mb-4">
            <FormInput
              label="EMAIL"
              placeholder="Email"
              autocomplete="email"
              onChange={value => setEmail(value.replace(/\s/g, ''))}
              value={email}
              errorMsg={error}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="PASSWORD"
              placeholder="Password"
              onChange={setPassword}
              value={password}
              type="password"
              autocomplete="new-password"
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="CONFIRM PASSWORD"
              placeholder="Confirm Password"
              onChange={value => {
                setPasswordConfirmationError(null)
                setPasswordConfirmation(value)
              }}
              value={passwordConfirmation}
              errorMsg={passwordConfirmationError}
              type="password"
              autocomplete="confirm-password"
            />
          </div>

          <button
            className="bg-gradient-to-r from-red-400 to-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            onClick={onSubmit}
          >
            Create My Account
          </button>
        </form>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center font-semibold mx-4 mb-0">Or</p>
        </div>

        <AuthProviderButtons providers={providers} type="register" />

        <div className="flex items-center justify-center">
          <div className="text-xs sm:text-sm">
            Do you already have an account?
            <Link href="/auth/login">
              <a className="font-bold border-b-2 border-solid border-gray-300">Login</a>
            </Link>
          </div>
        </div>

        <hr />
      </div>

      <style jsx>{`
        .auth-logo {
          display: inline-block;
          margin-right: 10px;
          margin-left: 10px;
          max-height: 18px;
          max-width: 18px;
        }
      `}</style>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken()
  return {
    props: { providers, csrfToken }
  }
}
