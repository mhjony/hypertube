import fetch from 'isomorphic-unfetch'

const API = 'http://localhost:8080'

const signup = async (email, password) => {
  const res = await fetch(`${API}/auth/create-user`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()
  return data
}

const getPasswordResetLink = async email => {
  const res = await fetch(`${API}/auth/get-reset-password-link`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })

  const data = await res.json()
  return data
}

const resetPassword = async (email, resetPasswordCode, password) => {
  const res = await fetch(`${API}/auth/reset-password`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: decodeURIComponent(email),
      passwordResetCode: decodeURIComponent(resetPasswordCode),
      password
    })
  })

  const data = await res.json()
  return data
}

export default {
  API,
  getPasswordResetLink,
  signup,
  resetPassword,
}
