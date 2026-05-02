import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-sand)] px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-10 py-12 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-teal)]">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
          That route does not exist in this workspace yet.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-2xl bg-[var(--color-ink)] px-5 py-3 text-sm font-medium text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
