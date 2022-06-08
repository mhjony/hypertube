const API = 'http://localhost:8000'

const updateProfile = async (user_id, email, newEmail, user_name, first_name, last_name) => {
  console.log('I am updateProfile SERVICE 02')

  const res = await fetch(`${API}/profile/update`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id,
      email: decodeURIComponent(email),
      newEmail: decodeURIComponent(newEmail),
      first_name,
      last_name,
      user_name,
      email
    })
  })
  console.log('I am updateProfile SERVICE 03')

  const data = await res.json()
  return data
}

export default {
  API,
  updateProfile
}
