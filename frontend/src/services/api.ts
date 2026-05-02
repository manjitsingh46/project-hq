import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080/api'

const AUTH_STORAGE_KEY = 'project-manager-auth'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY)
  if (rawSession) {
    const session = JSON.parse(rawSession) as { token?: string }
    if (session.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    return Promise.reject(error)
  },
)

export { AUTH_STORAGE_KEY }
