import { useState, useEffect } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { useJournal } from '../hooks/useJournal'
import { formatDate } from '../lib/dateUtils'
import { format, parseISO } from 'date-fns'

export default function Journal({ user }) {
  const { entry, history, saveJournal } = useJournal(user?.id)
  const [local, setLocal]   = useState({ worked: '', didnt: '', tomorrow: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    setLocal({
      worked: entry.worked || '',
      didnt:  entry.didnt || '',
      tomorrow: entry.tomorrow || '',
    })
  }, [entry])

  const handleSave = async () => {
    setSaving(true)
    await saveJournal(local)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Journal</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>3 sentences before sleep. That's the whole habit.</div>
        </div>
        <Button variant="accent" onClick={handleSave} disabled={saving}>
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save entry'}
        </Button>
      </div>

      <Card>
        <CardTitle>Today — {formatDate()}</CardTitle>
        <SectionLabel style={{ marginTop: 0 }}>What worked today?</SectionLabel>
        <textarea
          className="journal-input"
          placeholder="One thing that went well..."
          value={local.worked}
          onChange={e => setLocal(p => ({ ...p, worked: e.target.value }))}
        />
        <SectionLabel>What didn't work?</SectionLabel>
        <textarea
          className="journal-input"
          placeholder="One thing that went wrong or you avoided..."
          value={local.didnt}
          onChange={e => setLocal(p => ({ ...p, didnt: e.target.value }))}
        />
        <SectionLabel>One move tomorrow</SectionLabel>
        <textarea
          className="journal-input"
          placeholder="The single most important thing tomorrow..."
          value={local.tomorrow}
          onChange={e => setLocal(p => ({ ...p, tomorrow: e.target.value }))}
        />
      </Card>

      <Card>
        <CardTitle>Past entries</CardTitle>
        {history.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--faint)' }}>No entries yet. Start tonight.</div>
        )}
        {history.map(h => (
          <div key={h.date} className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="font-mono text-[11px] mb-1.5" style={{ color: 'var(--acc)' }}>
              {format(parseISO(h.date), 'EEE d MMM')}
            </div>
            {h.worked && <div className="text-xs mb-1" style={{ color: 'var(--text)' }}>✓ {h.worked}</div>}
            {h.didnt  && <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>✗ {h.didnt}</div>}
            {h.tomorrow && <div className="text-xs" style={{ color: 'var(--muted)' }}>→ {h.tomorrow}</div>}
          </div>
        ))}
      </Card>
    </div>
  )
}
