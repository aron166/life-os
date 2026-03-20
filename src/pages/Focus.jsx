import { Card, CardTitle } from '../components/ui/Card'
import { Callout } from '../components/ui/Callout'
import { FocusTimer } from '../components/focus/FocusTimer'

const RULES = [
  { num: '1', title: 'One task visible at a time.', desc: 'Sticky note. Notion open to that task only. Nothing else on screen.' },
  { num: '2', title: '90/15 rhythm.', desc: '90 min on, 15 min real break. Not Pomodoro — too short for dev work.' },
  { num: '3', title: 'Phone in another room.', desc: 'Not face-down. Not silent. Another room. The visual presence alone tanks focus.' },
  { num: '4', title: '15 min solo thinking — no AI.', desc: 'Every morning. Notebook. Your brain owns the strategy. AI executes.' },
]

const TOOLKIT = [
  { title: 'Body doubling', desc: 'Work on a silent video call. Focusmate.com — free, works.' },
  { title: '2-minute start rule', desc: 'Open the file. Write one line. Set timer. You don\'t need motivation — starting creates it.' },
  { title: 'Brain dump trigger', desc: 'When overwhelmed: dump everything, then pick 1 thing. Nothing else exists until that\'s done.' },
  { title: 'No decision mornings', desc: 'Same breakfast, same morning sequence. Decision fatigue is real — protect the morning.' },
]

const BAD_HABITS = [
  { title: 'Phone first thing', fix: 'Phone physically across the room before sleep. Water + face splash replaces the dopamine hit. New trigger: ritual before phone, always.' },
  { title: 'Staying up doing nothing', fix: 'Hard cutoff 23:00. Phone on charger in hallway. Replace scroll with 10 pages of a book. Starts boring — gets easier.' },
  { title: 'Procrastinating then binge-working', fix: '2-minute start rule. The task is just "open the file." That\'s it. The rest follows.' },
  { title: 'Eating trash or skipping meals', fix: 'Batch cook Sunday. When hungry you eat what\'s available. Make the good option the easy option.' },
]

export default function Focus() {
  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Focus rules</h1>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>ADHD-tuned. Print this. Put it on your wall.</div>
      </div>

      <Callout type="warn">
        You don't lack willpower. You lack friction in the wrong places. These rules create the right friction.
      </Callout>

      {/* Timer */}
      <FocusTimer />

      <div className="grid md:grid-cols-2 gap-3.5 mt-3.5">
        <Card>
          <CardTitle>The 4 hard rules</CardTitle>
          {RULES.map(r => (
            <div key={r.num} className="flex gap-2.5 mb-3 last:mb-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono flex-shrink-0 mt-0.5"
                style={{ background: 'var(--bg4)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                {r.num}
              </div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{r.title}</strong> {r.desc}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>ADHD toolkit</CardTitle>
          <div className="flex flex-col gap-2.5">
            {TOOLKIT.map(t => (
              <div key={t.title} className="rounded-card p-3" style={{ background: 'var(--bg3)' }}>
                <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>{t.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-0">
        <CardTitle>Kill the bad habits — replacement map</CardTitle>
        {BAD_HABITS.map((b, i) => (
          <div key={i} className="flex gap-2.5 py-2.5" style={{ borderBottom: i < BAD_HABITS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono flex-shrink-0 mt-0.5"
              style={{ background: 'var(--bg4)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              {i + 1}
            </div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{b.title}</strong> → {b.fix}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
