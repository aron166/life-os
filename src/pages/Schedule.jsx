import { useState, useEffect } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Callout } from '../components/ui/Callout'
import { Tag } from '../components/ui/Tag'
import { Button } from '../components/ui/Button'
import { useJournal } from '../hooks/useJournal'
import { SCHEDULES, DAY_TYPES } from '../lib/constants'

// Google Calendar integration
const GCAL_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function pushToGoogleCalendar(dayType, schedule) {
  if (!GCAL_CLIENT_ID) {
    alert('Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to your .env')
    return
  }

  const today = new Date().toISOString().split('T')[0]

  const scopes = 'https://www.googleapis.com/auth/calendar.events'
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GCAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/gcal-callback')}&response_type=token&scope=${encodeURIComponent(scopes)}`

  // Store pending action
  sessionStorage.setItem('gcal_pending', JSON.stringify({ dayType, date: today }))
  window.open(authUrl, '_blank', 'width=500,height=600')
}

export default function Schedule({ user }) {
  const { dayType, saveDayType } = useJournal(user?.id)
  const [selected, setSelected] = useState(dayType)

  useEffect(() => { setSelected(dayType) }, [dayType])

  const select = (type) => {
    setSelected(type)
    saveDayType(type)
  }

  const schedule = selected ? SCHEDULES[selected] : null

  const COLOR_BORDER = {
    blue:   { active: 'border-blue',   bg: 'bg-blue/10',   label: 'text-blue'   },
    orange: { active: 'border-orange', bg: 'bg-orange/10', label: 'text-orange' },
    green:  { active: 'border-green',  bg: 'bg-green/10',  label: 'text-green'  },
    acc:    { active: 'border-acc',    bg: 'bg-acc/10',    label: 'text-acc'    },
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Day schedule</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Pick your day type — the system adapts</div>
        </div>
        {selected && (
          <Button
            variant="accent"
            onClick={() => pushToGoogleCalendar(selected, schedule)}
            size="sm"
          >
            Push to Calendar
          </Button>
        )}
      </div>

      {/* Day type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {DAY_TYPES.map(dt => {
          const isActive = selected === dt.id
          const css = COLOR_BORDER[dt.color]
          return (
            <button
              key={dt.id}
              onClick={() => select(dt.id)}
              className="rounded-card px-3 py-3.5 text-center transition-all"
              style={{
                background: isActive ? `var(--${dt.color}-dim, var(--acc-dim))` : 'var(--bg2)',
                border: `1px solid ${isActive ? `var(--${dt.color}, var(--acc))` : 'var(--border)'}`,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              <div className="text-xl mb-1.5">{dt.icon}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>{dt.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>{dt.sub}</div>
            </button>
          )
        })}
      </div>

      {!selected && (
        <Callout type="acc">Select a day type above to see your full schedule.</Callout>
      )}

      {schedule && (
        <div className="animate-fade-in">
          <Callout type={schedule.calloutType}>{schedule.callout}</Callout>

          <Card>
            {schedule.blocks.map((block, i) => (
              <div
                key={i}
                className="grid gap-3 py-2.5"
                style={{
                  gridTemplateColumns: '52px 1fr',
                  borderBottom: i < schedule.blocks.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="font-mono text-[11px] pt-0.5" style={{ color: 'var(--muted)' }}>{block.time}</div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{block.title}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{block.desc}</div>
                  {block.tags && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {block.tags.map(tag => <Tag key={tag} label={tag} />)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Card>

          {/* Wins */}
          <div className="grid grid-cols-3 gap-2.5 mt-1">
            {schedule.wins.map((w, i) => (
              <div key={i} className="rounded-card py-3 text-center" style={{ background: 'var(--bg3)' }}>
                <div className="font-syne text-lg font-bold" style={{ color: 'var(--acc)' }}>{w.val}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{w.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
