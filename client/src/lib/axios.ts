import axios from 'axios'

export function authHeader() {
  const token = localStorage.getItem('_tkn')

  if (token) {
    return { Authorization: `Bearer ${token}` }
  } else {
    return {}
  }
}

export default axios.create({
  baseURL: 'http://localhost:8080',
  headers: authHeader(),
  withXSRFToken: true,
  withCredentials: true,
})
