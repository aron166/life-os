import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BOTTOM_NAV, MORE_NAV } from '../../lib/constants'
import { Modal } from '../ui/Modal'

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isMorePage = MORE_NAV.some(i => i.path === location.pathname)

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex safe-bottom"
        style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}
      >
        {BOTTOM_NAV.map(item => {
          if (item.path === '/more') {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
                style={{ color: isMorePage ? 'var(--acc)' : 'var(--faint)', background: 'none', border: 'none', minHeight: 56 }}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            )
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 no-underline transition-colors"
              style={({ isActive }) => ({
                color: isActive ? 'var(--acc)' : 'var(--faint)',
                minHeight: 56,
              })}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="grid grid-cols-2 gap-3">
          {MORE_NAV.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMoreOpen(false) }}
              className="flex flex-col items-center gap-2 py-4 rounded-card transition-colors"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}
