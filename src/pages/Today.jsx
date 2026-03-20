import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { HabitItem } from '../components/habits/HabitItem'
import { MoodCheckIn } from '../components/mood/MoodCheckIn'
import { FocusTimer } from '../components/focus/FocusTimer'
import { SleepWidget } from '../components/sleep/SleepWidget'
import { Modal } from '../components/ui/Modal'
import { useHabits } from '../hooks/useHabits'
import { useJournal } from '../hooks/useJournal'
import { useMood }    from '../hooks/useMood'
import { useSleep } from '../hooks/useSleep'
import { greeting, formatDate, thisWeekDates } from '../lib/dateUtils'
import { HABITS, MAIN_HABITS } from '../lib/constants'

export default function Today({ user }) {
  const { logs, streaks, weeklyLogs, toggle, useFreeze, freezeUsedThisWeek } = useHabits(user?.id)
  const { tasks, saveTasks, dayType, entry, saveJournal } = useJournal(user?.id)
  const { todayMood, weekMoods, logMood } = useMood(user?.id)
  const { todayLog, avgSleep, underSevenDays, logSleep } = useSleep(user?.id)
  const [sleepModal, setSleepModal] = useState(false)
  const [bedtime, setBedtime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('07:00')

  const mainHabits = HABITS.filter(h => MAIN_HABITS.includes(h.id))
  const doneCount  = mainHabits.filter(h => logs[h.id]).length
  const gymCount   = thisWeekDates().filter(date => weeklyLogs[date]?.gym).length
  const dayLabels  = { team: 'Team', bar: 'Bar', school: 'School', biz: 'Business' }

  const handleSaveSleep = async () => {
    await logSleep({ bedtime, wake_time: wakeTime })
    setSleepModal(false)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>
            {greeting()}, Áron
          </h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{formatDate()}</div>
        </div>
        <Link to="/schedule">
          <Button variant="accent">Pick day type →</Button>
        </Link>
      </div>

      {/* Mood */}
      <MoodCheckIn current={todayMood} onSelect={logMood} />

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3.5">
        {[
          { val: `${doneCount}/${mainHabits.length}`, lbl: 'Habits today', progress: true },
          { val: gymCount,                             lbl: 'Gym this week' },
          { val: dayLabels[dayType] || '—',           lbl: "Today's mode" },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-card p-4 text-center"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
          >
            <div className="font-syne text-2xl font-bold" style={{ color: 'var(--text)' }}>{m.val}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{m.lbl}</div>
            {m.progress && <ProgressBar value={doneCount} max={mainHabits.length} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3.5">
        {/* Habits card */}
        <Card>
          <CardTitle>Today's non-negotiables</CardTitle>
          {mainHabits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              done={!!logs[habit.id]}
              streak={streaks[habit.id]?.streak ?? 0}
              onToggle={toggle}
              onFreeze={useFreeze}
              freezeUsed={freezeUsedThisWeek(habit.id)}
            />
          ))}
        </Card>

        <div>
          {/* Tasks */}
          <Card>
            <CardTitle>Today's 3 tasks</CardTitle>
            <textarea
              className="journal-input"
              style={{ minHeight: 80 }}
              placeholder="Write your 3 tasks for today..."
              value={tasks}
              onChange={e => saveTasks(e.target.value)}
            />
          </Card>

          {/* Quick journal */}
          <Card>
            <CardTitle>Quick journal — end of day</CardTitle>
            <textarea
              className="journal-input"
              placeholder="What worked? What didn't? One thing tomorrow..."
              value={entry.quick_note || ''}
              onChange={e => saveJournal({ quick_note: e.target.value })}
            />
          </Card>

          {/* Sleep widget */}
          <SleepWidget
            todayLog={todayLog}
            avgSleep={avgSleep}
            underSevenDays={underSevenDays}
            onLog={() => setSleepModal(true)}
          />

          {/* Focus timer */}
          <FocusTimer />
        </div>
      </div>

      {/* Sleep log modal */}
      <Modal open={sleepModal} onClose={() => setSleepModal(false)} title="Log sleep">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Bedtime</label>
              <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-card"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Wake time</label>
              <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-card"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
          <Button variant="accent" onClick={handleSaveSleep} className="w-full justify-center">
            Save
          </Button>
        </div>
      </Modal>
    </div>
  )
}
