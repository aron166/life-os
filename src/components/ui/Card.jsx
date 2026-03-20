export function Card({ children, className = '', style }) {
  return (
    <div
      className={`rounded-lg mb-3.5 p-5 ${className}`}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', ...style }}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <div
      className={`font-syne font-semibold text-sm mb-3.5 flex items-center gap-2 ${className}`}
      style={{ color: 'var(--text)' }}
    >
      {children}
    </div>
  )
}
