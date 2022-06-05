const API = 'http://localhost:8000'

const resetPassword = async (password) => {
	
  const res = await fetch(`${API}/auth/reset-password`, {
	  
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password
    })
  })

  const data = await res.json()
  return data
}

export default {
  API,
  resetPassword
}
