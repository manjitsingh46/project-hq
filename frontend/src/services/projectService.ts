import { api } from './api'
import type {
  Member,
  PageResponse,
  Project,
  ProjectDetailResponse,
  ProjectRole,
} from '../types'

export interface CreateProjectPayload {
  name: string
  description: string
}

export interface ManageMemberPayload {
  userId: number
  role: ProjectRole
}

export const projectService = {
  async getProjects(page = 0, size = 12) {
    const { data } = await api.get<PageResponse<Project>>('/projects', {
      params: { page, size },
    })
    return data
  },

  async getProjectById(projectId: string | number) {
    const { data } = await api.get<ProjectDetailResponse>(`/projects/${projectId}`)
    return data
  },

  async createProject(payload: CreateProjectPayload) {
    const { data } = await api.post<Project>('/projects', payload)
    return data
  },

  async deleteProject(projectId: string | number) {
    await api.delete(`/projects/${projectId}`)
  },

  async addOrUpdateMember(projectId: string | number, payload: ManageMemberPayload) {
    const { data } = await api.post<Member>(`/projects/${projectId}/members`, payload)
    return data
  },

  async removeMember(projectId: string | number, userId: string | number) {
    await api.delete(`/projects/${projectId}/members/${userId}`)
  },
}
