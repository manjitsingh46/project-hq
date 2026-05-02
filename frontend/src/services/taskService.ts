import { api } from './api'
import type { PageResponse, Task, TaskStatus } from '../types'

export interface CreateTaskPayload {
  title: string
  description: string
  projectId: number
  assignedToUserId: number
  dueDate: string
  status?: TaskStatus
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  assignedToUserId?: number
  dueDate?: string
  status?: TaskStatus
}

export const taskService = {
  async getTasks(params: {
    page?: number
    size?: number
    status?: TaskStatus | 'ALL'
    projectId?: number
  }) {
    const { data } = await api.get<PageResponse<Task>>('/tasks', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 18,
        projectId: params.projectId,
        status: params.status === 'ALL' ? undefined : params.status,
      },
    })
    return data
  },

  async getProjectTasks(projectId: string | number, params?: { page?: number; size?: number; status?: TaskStatus | 'ALL' }) {
    const { data } = await api.get<PageResponse<Task>>(`/tasks/project/${projectId}`, {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 18,
        status: params?.status === 'ALL' ? undefined : params?.status,
      },
    })
    return data
  },

  async createTask(payload: CreateTaskPayload) {
    const { data } = await api.post<Task>('/tasks', payload)
    return data
  },

  async updateTask(taskId: string | number, payload: UpdateTaskPayload) {
    const { data } = await api.put<Task>(`/tasks/${taskId}`, payload)
    return data
  },

  async deleteTask(taskId: string | number) {
    await api.delete(`/tasks/${taskId}`)
  },
}
