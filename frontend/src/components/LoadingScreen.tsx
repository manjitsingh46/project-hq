interface LoadingScreenProps {
  label?: string
}

export function LoadingScreen({ label = 'Loading' }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-6">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur">
        <span className="size-3 animate-pulse rounded-full bg-[var(--color-accent)]" />
        <span>{label}</span>
      </div>
    </div>
  )
}
