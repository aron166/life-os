import { useState } from 'react'

export function HabitItem({ habit, done, streak, onToggle, onFreeze, freezeUsed, showInfo = true }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div
        className="flex items-center gap-3 py-2.5 cursor-pointer"
        style={{ minHeight: 44 }}
        onClick={() => onToggle(habit.id)}
      >
        {/* Checkbox */}
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            border: done ? 'none' : '1.5px solid var(--faint)',
            background: done ? 'var(--green)' : 'transparent',
          }}
        >
          {done && <span style={{ fontSize: 11, color: '#0a0a0a', fontWeight: 700 }}>✓</span>}
        </div>

        {/* Label */}
        <span
          className="flex-1 text-sm transition-opacity duration-200"
          style={{ color: 'var(--text)', opacity: done ? 0.4 : 1, textDecoration: done ? 'line-through' : 'none' }}
        >
          {habit.label}
        </span>

        {/* Streak */}
        {streak > 0 && (
          <span className="text-[11px] font-mono flex-shrink-0" style={{ color: 'var(--acc)' }}>
            {streak}d
          </span>
        )}

        {/* Info toggle — explicit 32px visual, 44px touch target via padding */}
        {showInfo && habit.description && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            className="flex items-center justify-center flex-shrink-0 rounded-full transition-all"
            style={{
              width: 28,
              height: 28,
              padding: 8,            // expands touch area without changing visual
              margin: -8,            // compensate so layout stays tight
              boxSizing: 'content-box',
              background: expanded ? 'var(--acc-dim)' : 'transparent',
              border: `1.5px solid ${expanded ? 'var(--acc2)' : 'var(--faint)'}`,
              color: expanded ? 'var(--acc)' : 'var(--faint)',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'DM Mono, monospace',
              letterSpacing: 0,
            }}
          >
            i
          </button>
        )}
      </div>

      {/* Expanded description */}
      {expanded && habit.description && (
        <div
          className="px-3 pb-3 pt-1 text-[12px] leading-relaxed animate-fade-in"
          style={{
            background: 'var(--bg3)',
            borderRadius: '0 0 8px 8px',
            color: 'var(--muted)',
            borderLeft: '2px solid var(--acc2)',
            margin: '0 0 8px',
          }}
        >
          {habit.description}

          {/* Freeze button */}
          {!done && (
            <div className="mt-2.5">
              <button
                onClick={e => { e.stopPropagation(); onFreeze && onFreeze(habit.id) }}
                disabled={freezeUsed}
                className="text-[11px] px-2.5 py-1 rounded transition-all disabled:opacity-40"
                style={{
                  background: 'var(--blue-dim)',
                  border: '1px solid var(--blue)',
                  color: 'var(--blue)',
                  cursor: freezeUsed ? 'not-allowed' : 'pointer',
                }}
              >
                {freezeUsed ? '❄ Freeze used this week' : '❄ Use streak freeze'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
