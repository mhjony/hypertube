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
        // When using localhost instead of docker: const backendJWT = await fetch('http://localhost:8000/auth/login', {
        const backendJWT = await fetch('http://server:8000/auth/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        const backendJWTJson = await backendJWT.json()
        return {
          provider: 'credentials',
          error: false,
          ...backendJWTJson
        }
      } catch (e) {
        console.error(e)
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
      if (account.provider === 'google') {
        const google = {
          provider: 'google',
          id_token: account.id_token
        }
        try {
          const backendJWT = await fetch('http://server:8000/auth/login', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(google)
          })
          const backendJWTJson = await backendJWT.json()
          user.accessToken = backendJWTJson.token
          user.user_id = backendJWTJson.user.user_id
		  user.first_name = backendJWTJson.user.first_name
		  user.last_name = backendJWTJson.user.last_name
		  user.user_name = backendJWTJson.user.user_name
		  user.language = backendJWTJson.user.language
          return true
        } catch (error) {
          console.error('Error from nextAuth callback for Google:', error)
        }
      }

      // For account.provider === '42-school'
      if (account.provider === '42-school') {
        const fortyTwo = {
          provider: '42-school',
          access_token: account.access_token
        }
        try {
          const backendJWT = await fetch('http://server:8000/auth/login', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(fortyTwo)
          })

          const backendJWTJson = await backendJWT.json()
          user.accessToken = backendJWTJson.token
          user.user_id = backendJWTJson.user.user_id
		  user.first_name = backendJWTJson.user.first_name
		  user.last_name = backendJWTJson.user.last_name
		  user.user_name = backendJWTJson.user.user_name
		  user.language = backendJWTJson.user.language
          return true
        } catch (error) {
          console.error('Error from nextAuth callback for 42:', error)
        }
      }

      if (account.type === 'credentials' && user.accessToken) {
        return true
      }

      if (account.type === 'credentials' || user.error) {
        return false
      }

      if (user?.error) {
        return false
      }

      return true
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      session.user_id = token.user_id
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
