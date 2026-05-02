import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign you in'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Login"
      subtitle="Sign in to manage projects, tasks, and team progress."
      footer={
        <span>
          New here?{' '}
          <Link to="/signup" className="font-semibold text-[var(--color-teal)]">
            Create an account
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="field"
            placeholder="you@company.com"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="field"
            placeholder="Minimum 6 characters"
            required
          />
        </label>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <button type="submit" className="primary-button w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </AuthShell>
  )
}
