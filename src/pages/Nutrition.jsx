import { useState } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Callout } from '../components/ui/Callout'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useMeals } from '../hooks/useMeals'
import { format, parseISO } from 'date-fns'

const MEALS = [
  { number: 1, label: 'Meal 1 — Breakfast', target: '35–40g protein', time: 'Within 30 min of waking' },
  { number: 2, label: 'Meal 2 — Lunch',     target: '40–50g protein', time: 'Biggest meal of the day' },
  { number: 3, label: 'Meal 3 — Evening',   target: '35–40g protein', time: 'Before 8pm ideally' },
]

const STAPLES = [
  { name: 'Eggs',                   desc: 'Best protein/forint. Always 12 in fridge.' },
  { name: 'Greek yogurt (Lidl)',    desc: 'High protein, cheap. 500g tub.' },
  { name: 'Chicken thigh',          desc: 'Batch cook Sunday. 4 portions.' },
  { name: 'Canned tuna / mackerel', desc: 'Zero prep, 25g protein. Keep 10 in.' },
  { name: 'Oats',                   desc: 'Slow carb. Add yogurt or protein powder.' },
  { name: 'Túró (cottage cheese)',  desc: 'Local, cheap, very high protein.' },
]

const PROTEIN_TARGET = 160
const CALORIE_TARGET = 2400

function MealCard({ meal: mealDef, log, onSave, onToggle }) {
  const [expanded, setExpanded] = useState(!!log?.content)

  return (
    <div
      className="rounded-lg p-4 mb-3"
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${log?.done ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color .2s',
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(mealDef.number)}
          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{
            border: log?.done ? 'none' : '1.5px solid var(--faint)',
            background: log?.done ? 'var(--green)' : 'transparent',
            cursor: 'pointer',
            minWidth: 20,
          }}
        >
          {log?.done && <span style={{ fontSize: 11, color: '#0a0a0a', fontWeight: 700 }}>✓</span>}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium" style={{ color: log?.done ? 'var(--muted)' : 'var(--text)', textDecoration: log?.done ? 'line-through' : 'none' }}>
                {mealDef.label}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--faint)' }}>
                {mealDef.time} · target {mealDef.target}
              </div>
            </div>
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-[11px] px-2 py-1 rounded flex-shrink-0"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
            >
              {expanded ? '▲ hide' : '▼ log'}
            </button>
          </div>

          {/* Protein badge */}
          {log?.protein_g > 0 && (
            <div className="mt-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded"
                style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                {log.protein_g}g protein
              </span>
            </div>
          )}

          {/* Logged content preview */}
          {!expanded && log?.content && (
            <div className="mt-1.5 text-xs italic" style={{ color: 'var(--muted)' }}>
              "{log.content}"
            </div>
          )}
        </div>
      </div>

      {/* Expanded log form */}
      {expanded && (
        <div className="mt-3 animate-fade-in">
          <div className="mb-2">
            <label className="block text-[11px] mb-1" style={{ color: 'var(--faint)' }}>What did you eat?</label>
            <textarea
              defaultValue={log?.content || ''}
              onBlur={e => onSave(mealDef.number, { content: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical', minHeight: 70, lineHeight: 1.5 }}
              placeholder={`e.g. 3 scrambled eggs, Greek yogurt, oats with honey...`}
            />
          </div>
          <div>
            <label className="block text-[11px] mb-1" style={{ color: 'var(--faint)' }}>Estimated protein (g)</label>
            <input
              type="number"
              defaultValue={log?.protein_g || ''}
              onBlur={e => onSave(mealDef.number, { protein_g: e.target.value ? Number(e.target.value) : null })}
              className="w-28 px-3 py-2 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="e.g. 38"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Nutrition({ user }) {
  const { meals, history, getMeal, saveMeal, toggleMeal, totalProtein } = useMeals(user?.id)
  const [showHistory, setShowHistory] = useState(false)

  const doneMeals = meals.filter(m => m.done).length
  const proteinPct = Math.min(100, Math.round((totalProtein / PROTEIN_TARGET) * 100))

  // Group history by date
  const historyByDate = history.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []
    acc[m.date].push(m)
    return acc
  }, {})

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Nutrition</h1>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Structure first. Quality compounds from there.</div>
      </div>

      {/* Macro targets + progress */}
      <div className="grid grid-cols-3 gap-3 mb-3.5">
        <div className="rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
          <div className="font-syne text-xl font-bold" style={{ color: 'var(--acc)' }}>
            {totalProtein > 0 ? totalProtein : '—'}<span className="text-sm font-normal">/{PROTEIN_TARGET}g</span>
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Protein today</div>
          {totalProtein > 0 && <ProgressBar value={totalProtein} max={PROTEIN_TARGET} color="var(--acc)" />}
        </div>
        <div className="rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
          <div className="font-syne text-xl font-bold" style={{ color: 'var(--green)' }}>{CALORIE_TARGET}</div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Calorie target</div>
        </div>
        <div className="rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
          <div className="font-syne text-xl font-bold" style={{ color: doneMeals === 3 ? 'var(--green)' : 'var(--text)' }}>
            {doneMeals}/3
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Meals eaten</div>
          <ProgressBar value={doneMeals} max={3} color="var(--green)" />
        </div>
      </div>

      {/* Meal cards */}
      <div>
        {MEALS.map(mealDef => (
          <MealCard
            key={mealDef.number}
            meal={mealDef}
            log={getMeal(mealDef.number)}
            onSave={saveMeal}
            onToggle={toggleMeal}
          />
        ))}
      </div>

      {/* Water tracker */}
      <div
        className="rounded-lg p-4 mb-3.5 flex items-center gap-4"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
      >
        <span className="text-xl">💧</span>
        <div className="flex-1">
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Water — 3L target</div>
          <div className="flex gap-1.5">
            {[500, 500, 500, 500, 500, 500].map((_, i) => (
              <div key={i} className="h-2 flex-1 rounded-full" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue)' }} />
            ))}
          </div>
        </div>
      </div>

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

      {/* History */}
      <div>
        <button
          onClick={() => setShowHistory(v => !v)}
          className="w-full py-2.5 rounded-card text-sm text-center mb-3"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
        >
          {showHistory ? '▲ Hide' : '▼ Show'} recent meal history
        </button>

        {showHistory && Object.entries(historyByDate).slice(0, 7).map(([date, dayMeals]) => (
          <div key={date} className="mb-3">
            <div className="text-[11px] font-mono mb-1.5" style={{ color: 'var(--acc)' }}>
              {format(parseISO(date), 'EEE d MMM')}
            </div>
            {dayMeals.filter(m => m.content).map(m => (
              <div key={m.meal_number} className="flex gap-2 py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-[11px] w-16 flex-shrink-0" style={{ color: 'var(--faint)' }}>
                  Meal {m.meal_number}
                </span>
                <span className="text-xs flex-1" style={{ color: 'var(--muted)' }}>{m.content}</span>
                {m.protein_g && (
                  <span className="text-[11px] font-mono flex-shrink-0" style={{ color: 'var(--green)' }}>
                    {m.protein_g}g
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Callout type="acc">
        Sunday ritual: 30 min batch cook. Rice cooker on, chicken in oven, eggs boiled. Whole week covered in one session.
      </Callout>
    </div>
  )
}
