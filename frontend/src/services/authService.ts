import { api } from './api'
import type { AuthResponse, User, UserRole } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async signup(payload: SignupPayload) {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload)
    return data
  },

  async me() {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}
