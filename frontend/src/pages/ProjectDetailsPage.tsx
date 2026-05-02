import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { EmptyState } from '../components/EmptyState'
import { SectionCard } from '../components/SectionCard'
import { TaskBoard } from '../components/TaskBoard'
import { projectService } from '../services/projectService'
import { taskService, type CreateTaskPayload } from '../services/taskService'
import { userService } from '../services/userService'
import type { ProjectDetailResponse, Task, TaskStatus, User } from '../types'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/format'

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [projectDetail, setProjectDetail] = useState<ProjectDetailResponse | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [taskForm, setTaskForm] = useState<CreateTaskPayload>({
    title: '',
    description: '',
    projectId: Number(projectId),
    assignedToUserId: 0,
    dueDate: '',
    status: 'TODO',
  })
  const [memberForm, setMemberForm] = useState({ userId: 0, role: 'MEMBER' as 'ADMIN' | 'MEMBER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadProjectWorkspace() {
    if (!projectId) return

    setLoading(true)
    setError('')

    try {
      const [detail, taskResponse] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getProjectTasks(projectId),
      ])

      setProjectDetail(detail)
      setTasks(taskResponse.content)
      setTaskForm((current) => ({
        ...current,
        projectId: Number(projectId),
        assignedToUserId:
          current.assignedToUserId || detail.members[0]?.id || detail.project.createdBy.id,
      }))

      if (detail.project.canManage) {
        const people = await userService.getUsers()
        setUsers(people)
        setMemberForm((current) => ({ ...current, userId: current.userId || people[0]?.id || 0 }))
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load project details'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjectWorkspace()
  }, [projectId])

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectId) return

    try {
      await taskService.createTask(taskForm)
      setTaskForm({
        title: '',
        description: '',
        projectId: Number(projectId),
        assignedToUserId: taskForm.assignedToUserId,
        dueDate: '',
        status: 'TODO',
      })
      await loadProjectWorkspace()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create task'))
    }
  }

  async function handleStatusChange(taskId: number, status: TaskStatus) {
    try {
      await taskService.updateTask(taskId, { status })
      await loadProjectWorkspace()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update task status'))
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await taskService.deleteTask(taskId)
      await loadProjectWorkspace()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete task'))
    }
  }

  async function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectId) return

    try {
      await projectService.addOrUpdateMember(projectId, memberForm)
      await loadProjectWorkspace()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update project member'))
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!projectId) return

    try {
      await projectService.removeMember(projectId, userId)
      await loadProjectWorkspace()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to remove member'))
    }
  }

  if (loading) {
    return <AppShell title="Project details" subtitle="Loading project data..." />
  }

  if (!projectDetail) {
    return (
      <AppShell title="Project not found" subtitle="The requested project could not be loaded.">
        <EmptyState
          title="Project missing"
          description="Double-check the URL or go back to the projects page to choose another workspace."
        />
      </AppShell>
    )
  }

  const { project, members } = projectDetail
  const availableUsers = users.filter((user) => !members.some((member) => member.id === user.id))

  return (
    <AppShell
      title={project.name}
      subtitle={`${project.description} This workspace has ${project.memberCount} members and ${project.taskCount} tracked tasks.`}
    >
      {error ? <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Team"
          description="Everyone assigned to this project, including their workspace access level."
        >
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Global {member.globalRole}
                  </span>
                  <span className="rounded-full bg-[var(--color-teal)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-teal)]">
                    Project {member.projectRole}
                  </span>
                  {project.canManage && member.id !== project.createdBy.id ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="rounded-2xl border border-rose-200 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {project.canManage ? (
            <form className="mt-5 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4" onSubmit={handleAddMember}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Add team member</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">User</span>
                  <select
                    value={memberForm.userId}
                    onChange={(event) => setMemberForm({ ...memberForm, userId: Number(event.target.value) })}
                    className="field"
                    required
                  >
                    {availableUsers.length ? (
                      availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    ) : (
                      <option value="">No new users available</option>
                    )}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Project role</span>
                  <select
                    value={memberForm.role}
                    onChange={(event) =>
                      setMemberForm({ ...memberForm, role: event.target.value as 'ADMIN' | 'MEMBER' })
                    }
                    className="field"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="primary-button" disabled={!availableUsers.length}>
                Save member
              </button>
            </form>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Tasks"
          description="Admins can create and assign tasks. Members can update the status of their own work."
        >
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current role</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{project.currentUserRole}</p>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Created</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{formatDate(project.createdAt)}</p>
            </div>
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Open tasks</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {tasks.filter((task) => task.status !== 'DONE').length}
              </p>
            </div>
          </div>

          {project.canManage ? (
            <form className="mb-6 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4" onSubmit={handleCreateTask}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Create task</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                    className="field"
                    placeholder="Draft sprint plan"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Due date</span>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                    className="field"
                    required
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                <textarea
                  className="field min-h-28 resize-none"
                  value={taskForm.description}
                  onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
                  placeholder="What exactly should get done?"
                  required
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Assign to</span>
                  <select
                    value={taskForm.assignedToUserId}
                    onChange={(event) =>
                      setTaskForm({ ...taskForm, assignedToUserId: Number(event.target.value) })
                    }
                    className="field"
                    required
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Starting status</span>
                  <select
                    value={taskForm.status}
                    onChange={(event) =>
                      setTaskForm({ ...taskForm, status: event.target.value as TaskStatus })
                    }
                    className="field"
                  >
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="primary-button">
                Create task
              </button>
            </form>
          ) : null}

          {tasks.length ? (
            <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
          ) : (
            <EmptyState
              title="No tasks in this project"
              description="Admins can create the first task here. Members will see their assigned work as soon as it’s added."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  )
}
