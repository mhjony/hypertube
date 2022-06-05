import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import fetch from 'isomorphic-unfetch'
import FortyTwoProvider from 'next-auth/providers/42-school'

const baseurl = 'http://localhost:8080'
const DEFAULT_REGISTRATION_URL = 'auth/register/'

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),

  FortyTwoProvider({
    clientId: process.env.FORTY_TWO_CLIENT_ID,
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET
  }),

  CredentialsProvider({
    async authorize(credentials) {
      const body = {
        username: credentials.username,
        password: credentials.password,
        provider: 'credentials'
      }
      try {
        const user = await fetch('http://localhost:8000/auth/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        const userJWTJson = await user.json()
        console.log('*** userJWTJson *** ', userJWTJson)
        return {
          provider: 'credentials',
          error: false,
          ...userJWTJson
        }
      } catch (e) {
        console.log('I am not able to make req::::', e)
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
    signIn: async ({ user, account }) => {
      if (account.type === 'credentials') {
        return true
      }

      if (user?.error) {
        return false
      }

      return true
    },
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
