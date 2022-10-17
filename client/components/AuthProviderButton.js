import React from 'react'
import { signIn } from 'next-auth/react'

const AuthProviderButtons = ({ type = 'login', providers }) => {
  const handleSignUp = provider => {
    const { id, name } = provider

    // Forward all Google logins to / since user can technically register also
    if (id === 'google') {
      signIn('google', { callbackUrl: '/' })
    }

    if (id === '42-school') {
      signIn(provider.id, { callbackUrl: '/42-school' })
    }
  }

  return (
    <>
      <div className="items-center justify-center flex-wrap">
        {providers &&
          Object.values(providers)
            .filter(provider => provider.id !== 'credentials')
            .map(provider => (
              <div
                key={provider.id}
                className="flex items-center justify-center border-2 border-red-500 m-2 rounded-md"
                onClick={() => handleSignUp(provider)}
              >
                <img src={`/logo-${provider.id}.png`} alt={provider.name} className="auth-logo" />

                {type === 'login' && (
                  <button className="text-red-600 py-2 px-2">Login with {provider.name}</button>
                )}

                {type === 'register' && (
                  <span className="text-red-600 py-2 px-2">Register with {provider.name}</span>
                )}
              </div>
            ))}
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
    </>
  )
}

export default AuthProviderButtons
