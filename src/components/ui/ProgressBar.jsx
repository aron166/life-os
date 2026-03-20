export function ProgressBar({ value, max, color = 'var(--green)', height = 4 }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div
      className="rounded-sm overflow-hidden mt-2"
      style={{ height, background: 'var(--bg4)' }}
    >
      <div
        className="h-full rounded-sm transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
