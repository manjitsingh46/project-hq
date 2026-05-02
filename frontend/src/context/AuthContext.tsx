import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { AUTH_STORAGE_KEY } from '../services/api'
import { authService, type LoginPayload, type SignupPayload } from '../services/authService'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isInitializing: boolean
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => void
}

interface SessionState {
  token: string
  user: User
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readSession(): SessionState | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  return raw ? (JSON.parse(raw) as SessionState) : null
}

function persistSession(session: SessionState | null) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const session = readSession()
    if (!session) {
      setIsInitializing(false)
      return
    }

    setUser(session.user)
    setToken(session.token)

    authService
      .me()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {
        persistSession(null)
        setUser(null)
        setToken(null)
      })
      .finally(() => setIsInitializing(false))
  }, [])

  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    persistSession(response)
    setUser(response.user)
    setToken(response.token)
  }

  const signup = async (payload: SignupPayload) => {
    const response = await authService.signup(payload)
    persistSession(response)
    setUser(response.user)
    setToken(response.token)
  }

  const logout = () => {
    persistSession(null)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'ADMIN',
        isInitializing,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
