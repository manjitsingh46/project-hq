import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { EmptyState } from '../components/EmptyState'
import { SectionCard } from '../components/SectionCard'
import { TaskBoard } from '../components/TaskBoard'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import type { Project, Task, TaskStatus } from '../types'
import { getErrorMessage } from '../utils/errors'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL')
  const [projectId, setProjectId] = useState<number | ''>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadTasks() {
    setLoading(true)
    setError('')
    try {
      const [taskResponse, projectResponse] = await Promise.all([
        taskService.getTasks({
          status,
          projectId: typeof projectId === 'number' ? projectId : undefined,
        }),
        projectService.getProjects(),
      ])
      setTasks(taskResponse.content)
      setProjects(projectResponse.content)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load tasks'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [status, projectId])

  async function handleStatusChange(taskId: number, nextStatus: TaskStatus) {
    try {
      await taskService.updateTask(taskId, { status: nextStatus })
      await loadTasks()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update task'))
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await taskService.deleteTask(taskId)
      await loadTasks()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete task'))
    }
  }

  return (
    <AppShell
      title="Tasks"
      subtitle="A focused view of work across projects, filtered by status and scoped to what you can actually act on."
    >
      {error ? <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <SectionCard
        title="Task board"
        description="Members see only their assigned work. Admins can monitor and adjust across the workspace."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={projectId}
              onChange={(event) =>
                setProjectId(event.target.value ? Number(event.target.value) : '')
              }
              className="field min-w-44"
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskStatus | 'ALL')}
              className="field min-w-44"
            >
              <option value="ALL">All statuses</option>
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        }
      >
        {loading ? (
          <div className="text-sm text-slate-500">Loading tasks...</div>
        ) : tasks.length ? (
          <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
        ) : (
          <EmptyState
            title="No tasks match these filters"
            description="Try switching projects or statuses, or create a few tasks inside a project workspace."
          />
        )}
      </SectionCard>
    </AppShell>
  )
}
