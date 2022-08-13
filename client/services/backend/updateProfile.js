const API = 'http://localhost:8000'

const updateProfile = async (user_id, email, user_name, first_name, last_name, accessToken) => {
  const url = `${API}/profile/update`

  if (!accessToken) {
    throw new Error('No access token provided')
  }

  const res = await fetch(url, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id,
      email: decodeURIComponent(email),
      user_name,
      first_name,
      last_name
    })
  })

  const data = await res.json()
  return data
}

export default {
  API,
  updateProfile
}
