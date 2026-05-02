import { CalendarClock, Trash2 } from 'lucide-react'
import type { Task, TaskStatus } from '../types'
import { formatDate, statusLabel } from '../utils/format'
import { TaskStatusBadge } from './TaskStatusBadge'

interface TaskBoardProps {
  tasks: Task[]
  onStatusChange: (taskId: number, status: TaskStatus) => void
  onDelete?: (taskId: number) => void
}

const columns: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export function TaskBoard({ tasks, onStatusChange, onDelete }: TaskBoardProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column)

        return (
          <div key={column} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {statusLabel(column)}
              </h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {columnTasks.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {columnTasks.map((task) => (
                <article key={task.id} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <TaskStatusBadge status={task.status} />
                      <h4 className="mt-3 text-base font-semibold text-slate-900">{task.title}</h4>
                    </div>
                    {task.canDelete && onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{task.description}</p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarClock className="size-4" />
                    <span>Due {formatDate(task.dueDate)}</span>
                    {task.overdue ? (
                      <span className="rounded-full bg-rose-100 px-2 py-1 font-semibold text-rose-700">
                        Overdue
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <p className="font-medium">{task.assignedTo.name}</p>
                    <p className="text-xs text-slate-500">{task.project.name}</p>
                  </div>

                  {task.canEdit ? (
                    <label className="mt-4 block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Update status
                      </span>
                      <select
                        value={task.status}
                        onChange={(event) =>
                          onStatusChange(task.id, event.target.value as TaskStatus)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-teal)]"
                      >
                        {columns.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
