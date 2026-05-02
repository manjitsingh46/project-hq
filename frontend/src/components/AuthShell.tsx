import { FolderKanban } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'

interface AuthShellProps extends PropsWithChildren {
  title: string
  subtitle: string
  footer: ReactNode
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-ink)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,162,97,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(61,124,109,0.22),_transparent_28%),linear-gradient(135deg,_#07131a_0%,_#0e1f28_48%,_#041018_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-200">
              <FolderKanban className="size-4 text-[var(--color-accent)]" />
              Project HQ
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Ship work faster with clean ownership, clearer roles, and visible progress.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Create projects, add teammates, assign work, and monitor overdue tasks from one focused workspace built for admins and members.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#f7f3ea] p-8 text-slate-900 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">
              Welcome
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-600">
              {footer}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
