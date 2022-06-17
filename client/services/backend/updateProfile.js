const API = 'http://localhost:8000'

const updateProfile = async (user_id, email, user_name, first_name, last_name) => {
  const res = await fetch(`${API}/profile/update`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id,
      email: decodeURIComponent(email),
      user_name,
      first_name,
      last_name,
      email
    })
  })

  const data = await res.json()

  console.log('---Succesfully Updated ptodile picture', data)
  return data
}

export default {
  API,
  updateProfile
}
