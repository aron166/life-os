import { Card, CardTitle } from '../components/ui/Card'
import { Callout } from '../components/ui/Callout'
import { HabitItem } from '../components/habits/HabitItem'
import { useHabits } from '../hooks/useHabits'
import { HABITS } from '../lib/constants'

const STAPLES = [
  { name: 'Eggs',              desc: 'Best protein/forint. Always 12 in fridge.' },
  { name: 'Greek yogurt (Lidl)',desc: 'High protein, cheap. 500g tub.' },
  { name: 'Chicken thigh',     desc: 'Batch cook Sunday. 4 portions.' },
  { name: 'Canned tuna / mackerel', desc: 'Zero prep, 25g protein. Keep 10 in.' },
  { name: 'Oats',              desc: 'Slow carb. Add yogurt or protein powder.' },
  { name: 'Túró (cottage cheese)', desc: 'Local, cheap, very high protein.' },
]

const MEAL_HABITS = ['meal1', 'meal2', 'meal3', 'water3l']

const MEAL_LABELS = {
  meal1: 'Meal 1 — breakfast (35–40g protein)',
  meal2: 'Meal 2 — lunch, biggest meal (40–50g protein)',
  meal3: 'Meal 3 — evening (35–40g protein)',
  water3l: '3L water hit',
}

export default function Nutrition({ user }) {
  const { logs, streaks, toggle } = useHabits(user?.id)
  const mealHabits = HABITS.filter(h => MEAL_HABITS.includes(h.id))

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Nutrition</h1>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Structure first. Quality compounds from there.</div>
      </div>

      {/* Macros */}
      <div className="flex gap-2.5 mb-3.5">
        {[
          { val: '160g', lbl: 'Protein target', color: 'var(--acc)' },
          { val: '2400', lbl: 'Calories target', color: 'var(--green)' },
          { val: '3L',   lbl: 'Water target',   color: 'var(--blue)'  },
        ].map(m => (
          <div key={m.lbl} className="flex-1 rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
            <div className="font-syne text-xl font-bold" style={{ color: m.color }}>{m.val}</div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{m.lbl}</div>
          </div>
        ))}
      </div>

      {/* Meal tracker */}
      <Card>
        <CardTitle>Track today's meals</CardTitle>
        {mealHabits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={{ ...habit, label: MEAL_LABELS[habit.id] || habit.label }}
            done={!!logs[habit.id]}
            streak={streaks[habit.id]?.streak ?? 0}
            onToggle={toggle}
            showInfo={false}
          />
        ))}
      </Card>

      {/* Staples */}
      <Card>
        <CardTitle>Budapest staples — always keep these in</CardTitle>
        <div className="grid grid-cols-2 gap-2.5">
          {STAPLES.map(s => (
            <div key={s.name} className="rounded-card p-3" style={{ background: 'var(--bg3)' }}>
              <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="acc">
        Sunday ritual: 30 min batch cook. Rice cooker on, chicken in oven, eggs boiled. Whole week covered in one session.
      </Callout>
    </div>
  )
}
