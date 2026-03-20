import { Card, CardTitle } from '../components/ui/Card'
import { HabitItem } from '../components/habits/HabitItem'
import { useHabits } from '../hooks/useHabits'
import { HABITS, HABIT_GROUPS } from '../lib/constants'
import { thisWeekDates, formatShort } from '../lib/dateUtils'
import { parseISO, format } from 'date-fns'

export default function Habits({ user }) {
  const { logs, streaks, weeklyLogs, toggle, useFreeze, freezeUsedThisWeek } = useHabits(user?.id)
  const weekDates = thisWeekDates()

  // Group habits
  const groups = Object.entries(HABIT_GROUPS).map(([key, label]) => ({
    key, label, habits: HABITS.filter(h => h.group === key)
  }))

  const totalDone  = HABITS.filter(h => logs[h.id]).length
  const totalHabits = HABITS.length

  // Weekly overview — days × main habits
  const mainHabits = HABITS.slice(0, 8)

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Habit tracker</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Streaks reset at midnight — check off daily</div>
        </div>
        <div className="font-syne font-bold text-xl" style={{ color: 'var(--acc)' }}>
          {totalDone}/{totalHabits}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3.5">
        {groups.map(({ key, label, habits }) => (
          <Card key={key}>
            <CardTitle>{label}</CardTitle>
            {habits.map(habit => (
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
        ))}
      </div>

      {/* Weekly heatmap */}
      <Card>
        <CardTitle>This week</CardTitle>
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full text-[11px]" style={{ borderCollapse: 'separate', borderSpacing: '4px 2px' }}>
            <thead>
              <tr>
                <td style={{ color: 'var(--faint)', width: 140 }}></td>
                {weekDates.map(d => (
                  <td key={d} className="text-center font-mono pb-1" style={{ color: 'var(--muted)', minWidth: 28 }}>
                    {format(parseISO(d), 'EEE')[0]}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {mainHabits.map(habit => (
                <tr key={habit.id}>
                  <td className="py-0.5 pr-2 text-[11px]" style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {habit.label.length > 22 ? habit.label.slice(0, 22) + '…' : habit.label}
                  </td>
                  {weekDates.map(d => {
                    const done = weeklyLogs[d]?.[habit.id]
                    return (
                      <td key={d} className="text-center">
                        <div
                          className="w-5 h-5 rounded mx-auto"
                          style={{ background: done ? 'var(--green)' : 'var(--bg4)' }}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
