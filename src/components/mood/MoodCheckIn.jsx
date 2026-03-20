import { MOOD_LEVELS } from '../../lib/constants'

export function MoodCheckIn({ current, onSelect }) {
  return (
    <div
      className="rounded-lg p-4 mb-3.5"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
    >
      <div className="text-[11px] font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--faint)' }}>
        Energy level today
      </div>
      <div className="flex gap-2">
        {MOOD_LEVELS.map(m => (
          <button
            key={m.level}
            onClick={() => onSelect(m.level)}
            className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-card transition-all"
            title={m.label}
            style={{
              background: current === m.level ? 'var(--acc-dim)' : 'var(--bg3)',
              border: current === m.level ? '1px solid var(--acc2)' : '1px solid var(--border)',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            <span
              className="font-mono text-[9px] leading-none tracking-tighter"
              style={{ color: current === m.level ? 'var(--acc)' : 'var(--faint)' }}
            >
              {m.icon}
            </span>
            <span
              className="text-[9px] font-medium"
              style={{ color: current === m.level ? 'var(--acc)' : 'var(--muted)' }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
