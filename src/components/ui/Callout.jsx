const STYLES = {
  warn:    { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'var(--orange)' },
  info:    { bg: 'var(--blue-dim)',   color: 'var(--blue)',   border: 'var(--blue)'   },
  success: { bg: 'var(--green-dim)',  color: 'var(--green)',  border: 'var(--green)'  },
  acc:     { bg: 'var(--acc-dim)',    color: 'var(--acc)',    border: 'var(--acc)'    },
  red:     { bg: 'var(--red-dim)',    color: 'var(--red)',    border: 'var(--red)'    },
}

export function Callout({ type = 'info', children, className = '' }) {
  const s = STYLES[type] || STYLES.info
  return (
    <div
      className={`rounded-card px-4 py-3 text-sm leading-relaxed mb-3.5 border-l-[3px] ${className}`}
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {children}
    </div>
  )
}
