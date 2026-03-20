import { TAG_TYPES } from '../../lib/constants'

const STYLES = {
  hard: { background: 'var(--red-dim)',    color: 'var(--red)'    },
  ai:   { background: 'var(--blue-dim)',   color: 'var(--blue)'   },
  soft: { background: 'var(--green-dim)',  color: 'var(--green)'  },
  flex: { background: 'var(--orange-dim)', color: 'var(--orange)' },
}

export function Tag({ label }) {
  const type = TAG_TYPES[label] || 'soft'
  return (
    <span
      className="inline-block text-[11px] px-2 py-0.5 rounded-full font-mono"
      style={STYLES[type]}
    >
      {label}
    </span>
  )
}
