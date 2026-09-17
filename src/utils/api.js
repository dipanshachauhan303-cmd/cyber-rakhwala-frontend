const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const request = async (method, path, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(BASE_URL + path, options)
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  post: (path, body, token) => request('POST', path, body, token),
  get: (path, token) => request('GET', path, null, token),
  put: (path, body, token) => request('PUT', path, body, token),
  patch: (path, body, token) => request('PATCH', path, body, token),
  delete: (path, token) => request('DELETE', path, null, token),
}

export const getToken = () => localStorage.getItem('cr_token')
export const getUser = () => {
  const u = localStorage.getItem('cr_user')
  return u ? JSON.parse(u) : null
}
export const setAuth = (token, user) => {
  localStorage.setItem('cr_token', token)
  localStorage.setItem('cr_user', JSON.stringify(user))
}
export const clearAuth = () => {
  localStorage.removeItem('cr_token')
  localStorage.removeItem('cr_user')
}