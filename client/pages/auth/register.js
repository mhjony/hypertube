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

  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(null)

  const onSubmit = async event => {
    event.preventDefault()

    setPasswordConfirmationError(null)

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError('Passwords do not match')
      return
    }

    if (password.length < 6 && passwordConfirmation.length < 6) {
      setPasswordConfirmationError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const signupResponse = await api.signup(firstName, lastName, username, email, password)

      // Get the signupResponse.errors object and set the error state
      if (signupResponse.errors) {
        const errors = Object.keys(signupResponse.errors).map(key => {
          return signupResponse.errors[key]
        })
        const errorMessages = errors.map(error => {
          if (error.param === 'email') {
            setEmailError(error.msg)
          }
          if (error.param === 'user_name') {
            setUsernameError(error.msg)
          }
          if (error.param === 'password') {
            setPasswordError(error.msg)
          }
          if (error.param === 'fist_name') {
            setFirstNameError(error.msg)
          }
          if (error.param === 'last_name') {
            setLastNameError(error.msg)
          }
        })

        setLoading(false)
        return
      }

      if (signupResponse.message === 'User account created successfully') {
      }

      // If signupResponse is successful, push to the login page
      if (signupResponse.message === 'User account created successfully') {
        Router.push('/auth/login')
      }
    } catch (e) {
      console.error('Registration Error:', e)
      setError('An error occured while registering. Please try again.')
    }

    setLoading(false)
  }

  const disabled = password.length === 0 || passwordConfirmation.length === 0 || email.length === 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-800">
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
              errorMsg={firstNameError}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="LAST NAME"
              placeholder="Lastname"
              autocomplete="lastName"
              onChange={value => setLastName(value)}
              value={lastName}
              errorMsg={lastNameError}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="USERNAME"
              placeholder="Username"
              autocomplete="username"
              onChange={value => setUsername(value)}
              value={username}
              errorMsg={usernameError}
            />
          </div>
          <div className="mb-4">
            <FormInput
              label="EMAIL"
              placeholder="Email"
              autocomplete="email"
              onChange={value => setEmail(value.replace(/\s/g, ''))}
              value={email}
              errorMsg={emailError}
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
              errorMsg={passwordError}
            />
          </div>

          {error && <p className="text-red-600 text-center text-sm mt-2 mb-2">{error}</p>}

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
            disabled={disabled && disabled}
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
            Do you already have an account? &nbsp;
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
