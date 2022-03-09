import React, { useState } from 'react'
import { signIn, useSession, getProviders, getCsrfToken } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

const login = ({ providers, csrfToken }) => {
  const { query } = useRouter()
  const { data: session } = useSession()

  const { error, success } = query

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    signIn('credentials', { username: email, password })
  }

  const errorMessage = error ? t(`authLogin.errors.${error}`) : null
  const showError = error && email.length === 0 && password.length === 0
  const showSuccess = success && email.length === 0 && password.length === 0
  const hasEmptyField = password.length === 0 || email.length === 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="box">
        <form onSubmit={onSubmit} className="mb-6 md:mb-8">
          <h2 className="font-bold text-xl md:text-2xl mb-4">Hypertube</h2>

          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="mb-4">
            <FormInput
              label="Email"
              placeholder="Email"
              onChange={setEmail}
              value={email}
              autocomplete="email"
            />
          </div>

          <div className="mb-4">
            <FormInput
              label="Password"
              placeholder="Password"
              onChange={setPassword}
              value={password}
              type="password"
              autocomplete="current-password"
              onEnter={onSubmit}
            />
            {showSuccess && <p className="text-green-600 text-sm mt-2 mb-2">{t(success)}</p>}
          </div>

          <Button loading={loading} onClick={onSubmit} disabled={hasEmptyField} className="w-full">
            Login
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <div className="text-xs sm:text-sm">
            Don't have an account?
            <Link href="/auth/register">
              <a className="font-bold border-b-2 border-solid border-gray-300">Create an account</a>
            </Link>
          </div>
        </div>

        {Object.values(providers).map(provider => (
          <div className="flex items-center justify-center">
            {/* <img src={`/logo-${provider.id}.png`} alt={provider.name} className="w-8 mb-5" /> */}

            <button
              key={provider.id}
              className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 border-red-500 rounded-md"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
      </div>
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
