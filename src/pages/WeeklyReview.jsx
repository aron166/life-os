import { useState, useEffect, useCallback } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Callout } from '../components/ui/Callout'
import { SectionLabel } from '../components/ui/SectionLabel'
import { useHabits } from '../hooks/useHabits'
import { useMood } from '../hooks/useMood'
import { supabase } from '../lib/supabase'
import { weekStart, thisWeekDates, isSunday } from '../lib/dateUtils'
import { HABITS, MAIN_HABITS, MOOD_LEVELS } from '../lib/constants'
import { format, parseISO } from 'date-fns'

export default function WeeklyReview({ user }) {
  const { weeklyLogs } = useHabits(user?.id)
  const { weekMoods }  = useMood(user?.id)
  const [review, setReview] = useState({ what_worked: '', what_to_drop: '', priority_next_week: '' })
  const [saved, setSaved]   = useState(false)
  const [gymCount, setGymCount] = useState(0)
  const [taskCount, setTaskCount] = useState(0)

  const weekKey = weekStart()
  const weekDates = thisWeekDates()
  const isTodaySunday = isSunday()

  const fetch = useCallback(async () => {
    if (!user?.id) return
    const [revRes, gymRes, taskRes] = await Promise.all([
      supabase.from('weekly_reviews').select('*').eq('user_id', user.id).eq('week_start', weekKey).single(),
      supabase.from('gym_logs').select('date').eq('user_id', user.id).in('date', weekDates),
      supabase.from('tasks').select('content').eq('user_id', user.id).in('date', weekDates),
    ])
    if (revRes.data) setReview(revRes.data)
    setGymCount([...new Set((gymRes.data || []).map(l => l.date))].length)
    setTaskCount((taskRes.data || []).filter(t => t.content?.trim()).length)
  }, [user?.id, weekKey])

  useEffect(() => { fetch() }, [fetch])

  const save = async () => {
    await supabase.from('weekly_reviews').upsert({
      user_id: user.id, week_start: weekKey, ...review
    }, { onConflict: 'user_id,week_start' })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  // Calculate habit completion rate for the week
  const mainHabits = HABITS.filter(h => MAIN_HABITS.includes(h.id))
  const totalChecks = weekDates.reduce((sum, d) =>
    sum + mainHabits.filter(h => weeklyLogs[d]?.[h.id]).length, 0)
  const maxChecks = weekDates.length * mainHabits.length
  const completionRate = maxChecks > 0 ? Math.round((totalChecks / maxChecks) * 100) : 0

  // Mood for the week
  const moodMap = {}
  weekMoods.forEach(m => { moodMap[m.date] = m.mood_level })
  const avgMood = weekMoods.length > 0
    ? (weekMoods.reduce((s, m) => s + m.mood_level, 0) / weekMoods.length).toFixed(1)
    : null

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Weekly review</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            Week of {format(parseISO(weekKey), 'd MMM')}
          </div>
        </div>
        <Button variant="accent" onClick={save}>{saved ? 'Saved ✓' : 'Save review'}</Button>
      </div>

      {isTodaySunday && (
        <Callout type="acc">
          🗓 It's Sunday — time for your weekly review. Take 10 minutes.
        </Callout>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3.5">
        {[
          { val: `${completionRate}%`, lbl: 'Habit completion',  color: completionRate >= 70 ? 'var(--green)' : 'var(--orange)' },
          { val: gymCount,             lbl: 'Gym sessions',       color: 'var(--acc)' },
          { val: taskCount,            lbl: 'Days with tasks',    color: 'var(--blue)' },
          { val: avgMood ? `${avgMood}/5` : '—', lbl: 'Avg mood', color: 'var(--purple)' },
        ].map((m, i) => (
          <div key={i} className="rounded-card p-4 text-center" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div className="font-syne text-2xl font-bold" style={{ color: m.color }}>{m.val}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{m.lbl}</div>
          </div>
        ))}
      </div>

      {/* Habit heatmap for the week */}
      <Card>
        <CardTitle>Habit completion this week</CardTitle>
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-[11px]">
            <thead>
              <tr>
                <td style={{ color: 'var(--faint)', width: 120, paddingBottom: 6 }} />
                {weekDates.map(d => (
                  <td key={d} className="text-center font-mono pb-1.5" style={{ color: 'var(--muted)', minWidth: 32 }}>
                    {format(parseISO(d), 'EEE')[0]}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {mainHabits.map(h => (
                <tr key={h.id}>
                  <td className="py-0.5 pr-2" style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {h.label.length > 18 ? h.label.slice(0, 18) + '…' : h.label}
                  </td>
                  {weekDates.map(d => (
                    <td key={d} className="text-center py-0.5">
                      <div className="w-6 h-6 rounded mx-auto" style={{ background: weeklyLogs[d]?.[h.id] ? 'var(--green)' : 'var(--bg4)' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mood pattern */}
      {weekMoods.length > 0 && (
        <Card>
          <CardTitle>Mood pattern</CardTitle>
          <div className="flex gap-2 items-end">
            {weekDates.map(d => {
              const level = moodMap[d] ?? 0
              const mood = MOOD_LEVELS.find(m => m.level === level)
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm transition-all"
                    style={{ height: level ? level * 14 : 4, background: level ? 'var(--purple)' : 'var(--bg4)' }}
                  />
                  <div className="text-[9px] font-mono" style={{ color: 'var(--faint)' }}>
                    {format(parseISO(d), 'EEE')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Review questions */}
      <Card>
        <CardTitle>3 review questions</CardTitle>
        <SectionLabel style={{ marginTop: 0 }}>What worked this week?</SectionLabel>
        <textarea className="journal-input" value={review.what_worked || ''} style={{ minHeight: 80 }}
          onChange={e => setReview(p => ({ ...p, what_worked: e.target.value }))}
          placeholder="Habits, projects, behaviours that moved the needle..." />
        <SectionLabel>What should you drop or change?</SectionLabel>
        <textarea className="journal-input" value={review.what_to_drop || ''} style={{ minHeight: 80 }}
          onChange={e => setReview(p => ({ ...p, what_to_drop: e.target.value }))}
          placeholder="What drained you, wasted time, or doesn't align anymore..." />
        <SectionLabel>What's the priority next week?</SectionLabel>
        <textarea className="journal-input" value={review.priority_next_week || ''} style={{ minHeight: 80 }}
          onChange={e => setReview(p => ({ ...p, priority_next_week: e.target.value }))}
          placeholder="The one thing that would make next week a win..." />
      </Card>
    </div>
  )
}
