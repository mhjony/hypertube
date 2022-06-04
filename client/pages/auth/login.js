import React, { useState } from 'react'
import { signIn, useSession, getProviders } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

const login = ({ providers }) => {
  const { query } = useRouter()
  const { data: session } = useSession()

  const { error, success } = query

  const [username, setUsername] = useState('tasmia')
  const [password, setPassword] = useState('1234aA')
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    signIn('credentials', { username, password })
  }

  const errorMessage = error ? 'Error while trying to login' : null
  const showError = error && username.length === 0 && password.length === 0
  const showSuccess = success && username.length === 0 && password.length === 0
  const hasEmptyField = username.length === 0 || password.length === 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form onSubmit={onSubmit} className="mb-6 md:mb-8">
          <h2 className="font-bold text-xl md:text-2xl mb-4">Hypertube</h2>

          {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
          <div className="mb-4">
            <FormInput
              label="Username"
              placeholder="Username"
              onChange={setUsername}
              value={username}
              autocomplete="username"
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="Password"
              placeholder="Password"
              onChange={setPassword}
              value={password}
              type="password"
              autocomplete="password"
            />
            {showSuccess && <p className="text-green-600 text-sm mt-2 mb-2">{t(success)}</p>}
          </div>

          <Button loading={loading} onClick={onSubmit} disabled={hasEmptyField} className="w-full">
            Login
          </Button>
        </form>

        <div className="flex items-center justify-center mb-2">
          <div className="text-xs sm:text-sm">
            Forgot Password?
            <Link href="/auth/forgot-password">
              <a className="font-bold border-b-2 border-solid border-gray-300">
                Forgotten your password?
              </a>
            </Link>
          </div>
        </div>
        <hr />

        <div className="flex items-center justify-center mb-2">
          <div className="text-xs sm:text-sm">
            Don't have an account?
            <Link href="/auth/register">
              <a className="font-bold border-b-2 border-solid border-gray-300">Create an account</a>
            </Link>
          </div>
        </div>

        <div className="items-center justify-center flex-wrap">
          {Object?.values(providers)
            .filter(provider => provider.id !== 'credentials')
            .map(provider => (
              <div
                key={provider.name}
                className="flex items-center justify-center border-2 border-red-500 m-2 rounded-md hover:bg-red-300"
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
  // const csrfToken = await getCsrfToken()
  return {
    // props: { providers, csrfToken }
    props: { providers }
  }
}
