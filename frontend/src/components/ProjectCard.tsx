import { CalendarDays, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../types'
import { formatDate } from '../utils/format'

interface ProjectCardProps {
  project: Project
  onDelete?: (projectId: number) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-[var(--color-teal)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-teal)]">
            {project.currentUserRole}
          </span>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
        </div>
        {project.canManage && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="rounded-2xl border border-rose-200 px-3 py-2 text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2 className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-[var(--color-teal)]" />
          <span>{project.memberCount} members</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-[var(--color-accent)]" />
          <span>{project.taskCount} tasks</span>
        </div>
        <div>Started {formatDate(project.createdAt)}</div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Lead</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{project.createdBy.name}</p>
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="rounded-2xl bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
        >
          Open project
        </Link>
      </div>
    </article>
  )
}
