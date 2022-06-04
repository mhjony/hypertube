// import fetch from 'isomorphic-unfetch'

const API = 'http://localhost:8000'

const forgotPassword = async (email, resetPasswordCode, password) => {
  const res = await fetch(`${API}/auth/forgot-password`, {
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
  forgotPassword
}
