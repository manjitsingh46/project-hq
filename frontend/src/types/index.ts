export type UserRole = 'ADMIN' | 'MEMBER'
export type ProjectRole = 'ADMIN' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Member {
  id: number
  name: string
  email: string
  globalRole: UserRole
  projectRole: ProjectRole
  joinedAt: string
}

export interface Project {
  id: number
  name: string
  description: string
  createdAt: string
  createdBy: Member
  currentUserRole: ProjectRole
  canManage: boolean
  memberCount: number
  taskCount: number
}

export interface ProjectDetailResponse {
  project: Project
  members: Member[]
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  dueDate: string
  assignedTo: User
  createdBy: User
  project: Project
  overdue: boolean
  canEdit: boolean
  canDelete: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardSummary {
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  inProgressTasks: number
  todoTasks: number
  recentTasks: Task[]
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  validationErrors?: Record<string, string>
}
