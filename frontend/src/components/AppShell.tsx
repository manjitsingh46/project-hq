import { FolderKanban, LayoutDashboard, ListChecks, LogOut, PlusCircle } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface AppShellProps extends PropsWithChildren {
  title: string
  subtitle: string
  action?: ReactNode
}

export function AppShell({ title, subtitle, action, children }: AppShellProps) {
  const { logout, user } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/tasks', label: 'Tasks', icon: ListChecks },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-sand)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[2rem] bg-[var(--color-ink)] p-6 text-white shadow-[0_24px_80px_rgba(7,19,26,0.35)]">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[var(--color-ink)]">
              <PlusCircle className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Project HQ</p>
              <p className="text-sm text-slate-300">Team coordination board</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                    isActive
                      ? 'bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
            <p className="mt-3 text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-300">{user?.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-[var(--color-accent)]/18 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
              {user?.role}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/8"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </aside>

        <main className="rounded-[2rem] bg-white/75 p-6 shadow-[0_18px_60px_rgba(44,62,80,0.12)] backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-teal)]">
                Workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
