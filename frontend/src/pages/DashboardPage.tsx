import { CheckCircle2, Clock3, ListTodo, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { EmptyState } from '../components/EmptyState'
import { LoadingScreen } from '../components/LoadingScreen'
import { SectionCard } from '../components/SectionCard'
import { StatCard } from '../components/StatCard'
import { TaskStatusBadge } from '../components/TaskStatusBadge'
import { dashboardService } from '../services/dashboardService'
import type { DashboardSummary } from '../types'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatRelativeTime } from '../utils/format'

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .catch((err) => setError(getErrorMessage(err, 'Unable to load dashboard')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <LoadingScreen label="Loading dashboard" />
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle="A quick read on delivery health, recent work, and where attention is needed next."
    >
      {error ? <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={summary?.totalTasks ?? 0}
          hint="Everything currently visible in your workspace."
          accent="bg-slate-900"
          icon={<ListTodo className="size-5" />}
        />
        <StatCard
          label="Completed"
          value={summary?.completedTasks ?? 0}
          hint="Work items already pushed across the line."
          accent="bg-emerald-500"
          icon={<CheckCircle2 className="size-5" />}
        />
        <StatCard
          label="In progress"
          value={summary?.inProgressTasks ?? 0}
          hint="Tasks actively moving forward right now."
          accent="bg-amber-500"
          icon={<Clock3 className="size-5" />}
        />
        <StatCard
          label="Overdue"
          value={summary?.overdueTasks ?? 0}
          hint="Anything late should bubble up here fast."
          accent="bg-rose-500"
          icon={<TimerReset className="size-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Recent task activity"
          description="Latest updates across the tasks you can access."
        >
          {summary?.recentTasks.length ? (
            <div className="space-y-3">
              {summary.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <TaskStatusBadge status={task.status} />
                      <p className="text-base font-semibold text-slate-900">{task.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {task.project.name} · Assigned to {task.assignedTo.name}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500">
                    <p>Due {formatDate(task.dueDate)}</p>
                    <p className="mt-1">Updated {formatRelativeTime(task.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent activity"
              description="Create a project and add a few tasks to start seeing delivery momentum here."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Status snapshot"
          description="A simple distribution so teams can spot bottlenecks quickly."
        >
          <div className="space-y-4">
            {[
              ['To do', summary?.todoTasks ?? 0, 'bg-slate-500'],
              ['In progress', summary?.inProgressTasks ?? 0, 'bg-amber-500'],
              ['Done', summary?.completedTasks ?? 0, 'bg-emerald-500'],
            ].map(([label, value, color]) => {
              const safeTotal = Math.max(summary?.totalTasks ?? 0, 1)
              const width = `${(Number(value) / safeTotal) * 100}%`
              return (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${color}`} style={{ width }} />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}
