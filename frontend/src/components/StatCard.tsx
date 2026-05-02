import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  accent: string
  hint: string
  icon: ReactNode
}

export function StatCard({ label, value, accent, hint, icon }: StatCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-3 text-sm text-slate-600">{hint}</p>
        </div>
        <div className={`rounded-2xl px-4 py-3 text-white shadow-lg ${accent}`}>{icon}</div>
      </div>
    </article>
  )
}
