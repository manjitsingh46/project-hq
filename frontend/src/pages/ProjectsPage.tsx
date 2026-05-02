import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { EmptyState } from '../components/EmptyState'
import { ProjectCard } from '../components/ProjectCard'
import { SectionCard } from '../components/SectionCard'
import { projectService } from '../services/projectService'
import type { Project } from '../types'
import { getErrorMessage } from '../utils/errors'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function loadProjects() {
    setLoading(true)
    projectService
      .getProjects()
      .then((response) => setProjects(response.content))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load projects')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await projectService.createProject(form)
      setForm({ name: '', description: '' })
      loadProjects()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create project'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteProject(projectId: number) {
    try {
      await projectService.deleteProject(projectId)
      loadProjects()
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to delete project'))
    }
  }

  return (
    <AppShell
      title="Projects"
      subtitle="Create workspaces, review access, and keep every initiative tied to a clear owner."
    >
      {error ? <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Create project"
          description="Spin up a project space and start assigning tasks immediately."
        >
          <form className="space-y-4" onSubmit={handleCreateProject}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Project name</span>
              <input
                type="text"
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Website relaunch"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
              <textarea
                className="field min-h-32 resize-none"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="What does success look like for this project?"
                required
              />
            </label>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Active projects"
          description="Admins can delete projects. Members can open what they have access to."
        >
          {loading ? (
            <div className="text-sm text-slate-500">Loading projects...</div>
          ) : projects.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create your first project to begin adding members, tasks, and delivery milestones."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  )
}
