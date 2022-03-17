/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
//https://next-auth.js.org/tutorials/refresh-token-rotation
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import fetch from 'isomorphic-unfetch'

const baseurl = 'http://localhost:8080'
const DEFAULT_REGISTRATION_URL = 'auth/register'

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    id: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text', placeholder: 'tasmia' },
      password: { label: 'Password', type: 'password' }
    },

    async authorize(credentials, req) {
      try {
        const res = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: 'tasmia',
            password: '1234aA'
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const user = await res.json()

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      } catch (error) {
        console.log(error)
        return {
          provider: 'credentials',
          error: true
        }
      }
    }
  })
]

const options = {
  providers,
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/login',
    // signOut: '/auth/logout',
    error: '/auth/login', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: DEFAULT_REGISTRATION_URL
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      return { ...session, ...token }
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token = { ...user, accessToken: user.accessToken }
      }

      return token
    },
    async redirect({ baseUrl, url }) {
      // Redirect only if its new user url. Otherwise it doesn't work for some reason.
      if (url === DEFAULT_REGISTRATION_URL) {
        return url
      }
      return baseUrl
    }
  }
  // Enable debug messages in the console if you are having problems
  // debug: 'development'
}

export default NextAuth(options)
