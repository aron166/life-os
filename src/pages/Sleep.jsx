import { useState } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Callout } from '../components/ui/Callout'
import { useSleep } from '../hooks/useSleep'
import { thisWeekDates, sleepDuration } from '../lib/dateUtils'
import { format, parseISO } from 'date-fns'

export default function Sleep({ user }) {
  const { todayLog, weekLogs, logSleep, avgSleep, underSevenDays } = useSleep(user?.id)
  const [bedtime, setBedtime]   = useState(todayLog?.bedtime || '23:00')
  const [wakeTime, setWakeTime] = useState(todayLog?.wake_time || '07:00')
  const [saved, setSaved]       = useState(false)

  const weekDates = thisWeekDates()
  const logMap = {}
  weekLogs.forEach(l => { logMap[l.date] = l })

  const handleSave = async () => {
    await logSleep({ bedtime, wake_time: wakeTime })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const duration = sleepDuration(bedtime, wakeTime)

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Sleep tracker</h1>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Log and monitor your recovery</div>
      </div>

      {underSevenDays > 0 && (
        <Callout type="red">
          ⚠ You've slept under 7 hours on {underSevenDays} night{underSevenDays > 1 ? 's' : ''} this week. Prioritise sleep — everything else suffers without it.
        </Callout>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3.5">
        <div className="rounded-card p-4 text-center" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="font-syne text-2xl font-bold" style={{ color: avgSleep && Number(avgSleep) < 7 ? 'var(--red)' : 'var(--green)' }}>
            {avgSleep ?? '—'}h
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Avg this week</div>
        </div>
        <div className="rounded-card p-4 text-center" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="font-syne text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {todayLog?.duration_hours ? `${Number(todayLog.duration_hours).toFixed(1)}h` : '—'}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Last night</div>
        </div>
        <div className="rounded-card p-4 text-center" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="font-syne text-2xl font-bold" style={{ color: underSevenDays > 0 ? 'var(--orange)' : 'var(--green)' }}>
            {underSevenDays}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Nights &lt;7h</div>
        </div>
      </div>

      {/* Log tonight */}
      <Card>
        <CardTitle>Log last night</CardTitle>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Bedtime</label>
            <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Wake time</label>
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
        </div>
        {duration && (
          <div className="mb-4 text-center">
            <span className="font-syne text-lg font-bold" style={{ color: duration < 7 ? 'var(--orange)' : 'var(--green)' }}>
              {duration.toFixed(1)} hours
            </span>
            <span className="text-sm ml-2" style={{ color: 'var(--muted)' }}>
              {duration < 7 ? '— below 7h target' : '— above 7h target ✓'}
            </span>
          </div>
        )}
        <Button variant="accent" onClick={handleSave} className="w-full justify-center">
          {saved ? 'Saved ✓' : 'Log sleep'}
        </Button>
      </Card>

      {/* Weekly breakdown */}
      <Card>
        <CardTitle>This week</CardTitle>
        {weekDates.map(d => {
          const log = logMap[d]
          const hrs = log?.duration_hours
          return (
            <div key={d} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-mono text-[11px] w-14 flex-shrink-0" style={{ color: 'var(--muted)' }}>
                {format(parseISO(d), 'EEE d')}
              </span>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg4)' }}>
                {hrs && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (hrs / 9) * 100)}%`,
                      background: hrs < 7 ? 'var(--red)' : 'var(--green)',
                    }}
                  />
                )}
              </div>
              <span className="font-mono text-[11px] w-12 text-right" style={{ color: hrs ? (hrs < 7 ? 'var(--red)' : 'var(--green)') : 'var(--faint)' }}>
                {hrs ? `${Number(hrs).toFixed(1)}h` : '—'}
              </span>
            </div>
          )
        })}
        <div className="mt-3 text-[11px]" style={{ color: 'var(--faint)' }}>
          Target: 7+ hours. The green bar fills to 9h max.
        </div>
      </Card>
    </div>
  )
}
