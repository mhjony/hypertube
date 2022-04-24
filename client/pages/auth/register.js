/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
// import { getSession, signIn, getCsrfToken, getProviders } from 'next-auth/react'

import Button from '../../components/Button'

import FormInput from '../../components/FormInput'

import api from '../../services/backend/user'

export default function Register({ enabledProviders, csrfToken }) {
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
      setPasswordConfirmationError(t('authRegister.form.errors.passwordsDontMatch'))
      return
    }

    if (password.length < 4) {
      setPasswordConfirmationError(t('authRegister.form.errors.passwordMinimum'))
      return
    }

    setLoading(true)

    try {
      const signupResponse = await api.signup(email, password)

      if (signupResponse.message === 'account created') {
        await signIn('credentials', {
          username: email,
          password,
          redirect: false
        })
        Router.push('/flow/welcome')
        return
      }

      setError(signupResponse.message || `${signupResponse.error}. Please try again.`)
    } catch (e) {
      setError('An error occured while registering. Please try again.')
    }

    setLoading(false)
  }

  const handleOnChange = () => {
    setIsChecked(!isChecked)
  }

  const disabled =
    password.length === 0 || passwordConfirmation.length === 0 || email.length === 0 || !isChecked

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen w-full">
      <div className="box">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Register</h2>

        <form className="mb-6 md:mb-8" onSubmit={onSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="mb-4">
            <FormInput
              label="EMAIL ADDRESS"
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
              label="RE-ENTER PASSWORD"
              placeholder="Confirm Password"
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

          <Button loading={loading} disabled={disabled} onClick={onSubmit} className="w-full">
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
