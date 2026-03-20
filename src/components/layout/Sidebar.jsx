import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../lib/constants'
import { formatShort } from '../../lib/dateUtils'

const GROUPS = ['Today', 'Training', 'Mind', 'Progress']

export function Sidebar({ onSignOut }) {
  return (
    <nav
      className="flex flex-col gap-1 sticky top-0 h-screen overflow-y-auto py-7 px-4"
      style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)', width: 220, flexShrink: 0 }}
    >
      {/* Logo */}
      <div
        className="font-syne font-black text-lg tracking-tight pb-5 mb-2 px-2"
        style={{ color: 'var(--acc)', borderBottom: '1px solid var(--border)' }}
      >
        LIFE OS
        <span className="block font-sans font-normal text-xs mt-0.5" style={{ color: 'var(--muted)', letterSpacing: 0 }}>
          Áron's system
        </span>
      </div>

      {GROUPS.map(group => {
        const items = NAV_ITEMS.filter(i => i.group === group)
        return (
          <div key={group}>
            <div
              className="text-[10px] font-medium tracking-widest uppercase px-2 pt-3 pb-1"
              style={{ color: 'var(--faint)' }}
            >
              {group}
            </div>
            {items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-card w-full text-sm transition-all duration-150 no-underline ${isActive ? 'active-nav' : ''}`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'var(--acc-dim)' : 'transparent',
                  color: isActive ? 'var(--acc)' : 'var(--muted)',
                })}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.dot }}
                />
                {item.label}
              </NavLink>
            ))}
          </div>
        )
      })}

      {/* Footer */}
      <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-[11px] px-2 mb-2" style={{ color: 'var(--faint)' }}>
          {formatShort()}
        </div>
        <button
          onClick={onSignOut}
          className="text-[11px] px-2 py-1 rounded transition-colors"
          style={{ color: 'var(--faint)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = 'var(--muted)'}
          onMouseLeave={e => e.target.style.color = 'var(--faint)'}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
