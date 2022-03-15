/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'
import fetch from 'isomorphic-unfetch'

const baseurl = 'http://localhost:8080'
const DEFAULT_REGISTRATION_URL = 'auth/register'

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET
  }),
  CredentialsProvider({
    server: process.env.EMAIL_SERVER,
    from: 'hive.web.branch@gmail.com',
    authorize: async credentials => {
      const body = {
        username: credentials.username,
        password: credentials.password,
        provider: 'credentials'
      }
      try {
        const backendJWT = await fetch(`${baseurl}/business/auth/get-jwt`, {
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
    // If set, new users will be directed here on first sign in
    // https://www.youtube.com/watch?v=YFNsRogBqb0
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
          account
        }
        try {
          const backendJWT = await fetch(`${baseurl}/auth/login`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(google)
          })
          const backendJWTJson = await backendJWT.json()
          user.accessToken = backendJWTJson.token
          return true
        } catch (e) {
          return false
        }
      }

      if (account.type === 'credentials' && user.accessToken) {
        return true
      }

      // if user does not have accessToken or backend response errored
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
}

export default NextAuth(options)
