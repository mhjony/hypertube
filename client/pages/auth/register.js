/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { getSession, signIn, getCsrfToken, getProviders } from 'next-auth/react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from '../../components/Button'
import FormInput from '../../components/FormInput'

import api from '../../services/backend/user'

export default function Register({ enabledProviders, csrfToken }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('hola@gmail.com')
  const [password, setPassword] = useState('Odvhut93')
  const [passwordConfirmation, setPasswordConfirmation] = useState('Odvhut93')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(null)
  const [isChecked, setIsChecked] = useState(false)

  const notify = () => toast('Wow so easy!')

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
        notify()
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
    <div className="flex flex-col items-center justify-center  min-h-screen w-full">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Register</h2>

        <form className="mb-6 md:mb-8" onSubmit={onSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <div className="mb-4">
            <FormInput
              label="FIRST NAME"
              placeholder="firstName"
              autocomplete="firstName"
              onChange={value => setFirstName(value)}
              value={firstName}
              errorMsg={error}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="LAST NAME"
              placeholder="lastName"
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

          <Button loading={loading} onClick={onSubmit} className="w-full">
            Submit
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <div className="text-xs sm:text-sm">
            Do you already have an account?
            <Link href="/auth/login">
              <a className="font-bold border-b-2 border-solid border-gray-300">Login</a>
            </Link>
          </div>
        </div>

        <hr />

        {/* <AuthProviderButtons providers={enabledProviders} type="register" /> */}
      </div>

      <div>
        {/* <button onClick={notify}>Notify!</button> */}
        <ToastContainer />
      </div>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
// export async function getServerSideProps(context) {
//   const enabledProviders = await getProviders()

//   const { locale } = context

//   const { default: lngDict = {} } = await import(`locales/${locale}.json`)

//   const { req, res, query } = context
//   const session = await getSession({ req })

//   if (session && res && session.accessToken) {
//     res.writeHead(302, {
//       Location: query?.callbackUrl || '/'
//     })
//     res.end()
//     return { props: {} }
//   }

//   return {
//     props: {
//       enabledProviders,
//       lng: locale,
//       lngDict,
//       csrfToken: await getCsrfToken(context)
//     }
//   }
// }
