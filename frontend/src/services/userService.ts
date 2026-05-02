import { api } from './api'
import type { User } from '../types'

export const userService = {
  async getUsers(query = '') {
    const { data } = await api.get<User[]>('/users', {
      params: query ? { q: query } : undefined,
    })
    return data
  },
}
