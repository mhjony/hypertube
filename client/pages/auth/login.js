import React, { useState } from 'react'
import { signIn, getProviders, getCsrfToken } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FormInput from '../../components/FormInput'

const login = ({ providers, csrfToken }) => {
  const { query } = useRouter()

  const { error, success } = query

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    signIn('credentials', { username, password })
  }

  const showError = password.length === 0
  const errorMessage = showError ? 'Password can`t be empty' : null
  const showSuccess = success && username.length === 0 && password.length === 0
  const hasEmptyField = username.length === 0 || password.length === 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-800">
      <div className="shadow-lg rounded-lg bg-white border-0 px-14 pt-6 pb-8 mb-4 flex flex-col">
        <div>
          <Link href="/auth/login">
            <a className="text-xl font-bold text-center">HyperTube</a>
          </Link>
        </div>

        <form onSubmit={onSubmit} className="mb-2 md:mb-4 pt-6">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="mb-4">
            <FormInput
              label="username"
              placeholder="Username"
              onChange={setUsername}
              value={username}
              autocomplete="username"
              errorMsg={username.length === 0 ? 'Username is required' : null}
            />
          </div>
          <div className="mb-4">
            <FormInput
              label="password"
              placeholder="Password"
              onChange={setPassword}
              value={password}
              type="password"
              autocomplete="password"
              errorMsg={showError ? errorMessage : null}
            />
            {showSuccess && <p className="text-green-600 text-sm mt-2 mb-2">{t(success)}</p>}
          </div>

          <button
            type="submit"
            onClick={onSubmit}
            className="bg-gradient-to-r from-red-400 to-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          {error && (
            <p className="text-red-600 text-center text-sm mt-2 mb-2">
              Something Went Wring, Please try again!
            </p>
          )}
        </form>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center font-semibold mx-4 mb-0">Or</p>
        </div>

        {/* Login with OAuth */}
        <div className="items-center justify-center flex-wrap">
          {Object?.values(providers)
            .filter(provider => provider.id !== 'credentials')
            .map(provider => (
              <div
                key={provider.name}
                className="flex items-center justify-center border-2 border-red-500 m-2 rounded-md"
              >
                <img src={`/logo-${provider.id}.png`} alt={provider.name} className="auth-logo" />

                <button
                  key={provider.id}
                  className="text-red-600 py-2 px-2"
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                >
                  Login with {provider.name}
                </button>
              </div>
            ))}
        </div>

        <div className="flex items-center justify-center mt-4">
          <div className="text-xs sm:text-sm">
            <Link href="/auth/forgot-password">
              <a className="font-bold border-b-2 border-solid border-gray-300">
                Forgotten your password?
              </a>
            </Link>
          </div>
        </div>

        <div className="text-xs sm:text-sm rounded w-full">
          Don't have an account? &nbsp;
          <Link href="/auth/register">
            <a className="font-bold border-b-2 border-solid border-gray-300">Sign up</a>
          </Link>
        </div>
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

export default login

export async function getServerSideProps() {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken()
  return {
    props: { providers, csrfToken }
  }
}
