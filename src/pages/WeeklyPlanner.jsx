import { format, addDays, startOfWeek, isToday, isPast, isFuture } from 'date-fns'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useWeeklyPlan } from '../hooks/useWeeklyPlan'
import { DAY_TYPES, DAY_TYPE_COLOR, DAY_TYPE_BG, SCHEDULES } from '../lib/constants'
import { thisWeekDates } from '../lib/dateUtils'

const GCAL_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function pushWeekToGCal(weekPlan) {
  if (!GCAL_CLIENT_ID) {
    alert('Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to your .env')
    return
  }
  const assignedDays = Object.entries(weekPlan).filter(([, t]) => t)
  if (assignedDays.length === 0) {
    alert('No days assigned yet.')
    return
  }
  sessionStorage.setItem('gcal_pending_week', JSON.stringify(weekPlan))
  const scopes = 'https://www.googleapis.com/auth/calendar.events'
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${GCAL_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(window.location.origin + '/gcal-callback')}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scopes)}`
  window.open(authUrl, '_blank', 'width=500,height=600')
}

function DayCard({ date, dayType, onSelect }) {
  const d     = new Date(date + 'T12:00:00')
  const today = isToday(d)
  const past  = isPast(d) && !today
  const dayName = format(d, 'EEE')
  const dayNum  = format(d, 'd MMM')

  const typeInfo    = dayType ? DAY_TYPES.find(dt => dt.id === dayType) : null
  const schedule    = dayType ? SCHEDULES[dayType] : null
  const accentColor = typeInfo ? DAY_TYPE_COLOR[typeInfo.id] : 'var(--border)'
  const bgColor     = typeInfo ? DAY_TYPE_BG[typeInfo.id]   : 'var(--bg2)'

  return (
    <div
      className="rounded-card flex flex-col gap-2.5 p-3.5 transition-all"
      style={{
        background: bgColor,
        border: `1.5px solid ${today ? accentColor : 'var(--border)'}`,
        opacity: past && !typeInfo ? 0.55 : 1,
        minHeight: 160,
      }}
    >
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: today ? accentColor : 'var(--muted)' }}
          >
            {dayName}
            {today && <span className="ml-1.5 text-[9px] font-mono" style={{ color: accentColor }}>TODAY</span>}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--faint)' }}>{dayNum}</div>
        </div>
        {typeInfo && (
          <span className="text-lg leading-none">{typeInfo.icon}</span>
        )}
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-1">
        {DAY_TYPES.map(dt => {
          const active = dayType === dt.id
          return (
            <button
              key={dt.id}
              onClick={() => onSelect(date, active ? null : dt.id)}
              title={dt.label}
              className="text-base leading-none rounded transition-all"
              style={{
                background: active ? DAY_TYPE_BG[dt.id] : 'transparent',
                border: `1px solid ${active ? DAY_TYPE_COLOR[dt.id] : 'var(--border)'}`,
                padding: '3px 6px',
                cursor: 'pointer',
                opacity: past && !active ? 0.6 : 1,
              }}
            >
              {dt.icon}
            </button>
          )
        })}
      </div>

      {/* Assigned day type label */}
      {typeInfo && (
        <div className="text-[11px] font-medium" style={{ color: accentColor }}>
          {typeInfo.label}
        </div>
      )}

      {/* Key wins for this day type */}
      {schedule && schedule.wins.length > 0 && (
        <div className="flex flex-col gap-0.5 mt-auto">
          {schedule.wins.map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] font-semibold" style={{ color: accentColor }}>
                {w.val}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--faint)' }}>{w.lbl}</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!typeInfo && (
        <div className="mt-auto text-[10px]" style={{ color: 'var(--faint)' }}>
          tap icon to assign
        </div>
      )}
    </div>
  )
}

export default function WeeklyPlanner({ user }) {
  const { weekPlan, loading, setPlan } = useWeeklyPlan(user?.id)
  const weekDates = thisWeekDates()

  const monday   = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekLabel = `${format(monday, 'd MMM')} – ${format(addDays(monday, 6), 'd MMM yyyy')}`

  const assignedCount = Object.values(weekPlan).filter(Boolean).length

  // Summary line per day type count
  const summary = DAY_TYPES.reduce((acc, dt) => {
    const count = Object.values(weekPlan).filter(t => t === dt.id).length
    if (count > 0) acc.push(`${count}× ${dt.label}`)
    return acc
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>
            Weekly planner
          </h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{weekLabel}</div>
          {summary.length > 0 && (
            <div className="text-[11px] mt-1" style={{ color: 'var(--faint)' }}>
              {summary.join(' · ')}
            </div>
          )}
        </div>
        <Button
          variant="accent"
          onClick={() => pushWeekToGCal(weekPlan)}
          disabled={assignedCount === 0}
        >
          Push week to Calendar
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {DAY_TYPES.map(dt => (
          <div key={dt.id} className="flex items-center gap-1.5">
            <span className="text-sm">{dt.icon}</span>
            <span className="text-[11px]" style={{ color: 'var(--muted)' }}>{dt.label}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      {loading ? (
        <div className="text-sm" style={{ color: 'var(--faint)' }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5">
          {weekDates.map(date => (
            <DayCard
              key={date}
              date={date}
              dayType={weekPlan[date] ?? null}
              onSelect={setPlan}
            />
          ))}
        </div>
      )}

      {/* Week summary card */}
      {assignedCount > 0 && (
        <Card>
          <div
            className="text-[11px] font-medium tracking-widest uppercase mb-3"
            style={{ color: 'var(--faint)' }}
          >
            Week at a glance
          </div>
          <div className="flex flex-col gap-1.5">
            {weekDates.map(date => {
              const type = weekPlan[date]
              if (!type) return null
              const d    = new Date(date + 'T12:00:00')
              const info = DAY_TYPES.find(dt => dt.id === type)
              return (
                <div key={date} className="flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] w-7 flex-shrink-0"
                    style={{ color: 'var(--faint)' }}
                  >
                    {format(d, 'EEE')}
                  </span>
                  <span className="text-sm">{info?.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: DAY_TYPE_COLOR[type] }}
                  >
                    {info?.label}
                  </span>
                  <span className="text-[11px] ml-auto" style={{ color: 'var(--faint)' }}>
                    {info?.sub}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
