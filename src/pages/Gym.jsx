import { useState } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Callout } from '../components/ui/Callout'
import { ExerciseRow } from '../components/gym/ExerciseRow'
import { Modal } from '../components/ui/Modal'
import { useGym } from '../hooks/useGym'

const DAY_TYPES = [
  { id: 'push', label: 'Push',  sub: 'Chest · Shoulders · Triceps' },
  { id: 'pull', label: 'Pull',  sub: 'Back · Biceps' },
  { id: 'legs', label: 'Legs',  sub: 'Quads · Hamstrings · Calves' },
]

export default function Gym({ user }) {
  const { exercises, todayLogs, loading, saveSession, addExercise, editExercise, deleteExercise, getPR, isNewPR } = useGym(user?.id)
  const [selectedDay, setSelectedDay] = useState(null)
  const [sessionData, setSessionData] = useState({}) // { exerciseId: { sets, reps, weight_kg } }
  const [addModal, setAddModal] = useState(false)
  const [newExName, setNewExName] = useState('')
  const [saved, setSaved] = useState(false)

  const handleChange = (exId, field, value) => {
    setSessionData(prev => ({
      ...prev,
      [exId]: { ...(prev[exId] || {}), [field]: value }
    }))
  }

  const handleSave = async () => {
    if (!selectedDay) return
    const list = (exercises[selectedDay] || []).map(ex => ({
      exercise_name: ex.name,
      sets: sessionData[ex.id]?.sets,
      reps: sessionData[ex.id]?.reps,
      weight_kg: sessionData[ex.id]?.weight_kg,
    }))
    await saveSession(selectedDay, list)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddExercise = async () => {
    if (!newExName.trim() || !selectedDay) return
    await addExercise(selectedDay, newExName.trim())
    setNewExName('')
    setAddModal(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Gym log</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Log weights — track progressive overload</div>
        </div>
        {selectedDay && (
          <Button
            variant="accent"
            onClick={handleSave}
          >
            {saved ? 'Saved ✓' : 'Save session'}
          </Button>
        )}
      </div>

      {/* Day pills */}
      <div className="flex gap-2 flex-wrap mb-4">
        {DAY_TYPES.map(dt => (
          <button
            key={dt.id}
            onClick={() => { setSelectedDay(dt.id); setSessionData({}) }}
            className="px-4 py-1.5 rounded-full text-xs font-mono transition-all"
            style={{
              background: selectedDay === dt.id ? 'var(--acc-dim)' : 'transparent',
              border: `1px solid ${selectedDay === dt.id ? 'var(--acc2)' : 'var(--border)'}`,
              color: selectedDay === dt.id ? 'var(--acc)' : 'var(--muted)',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {!selectedDay && <Callout type="acc">Select a workout above to log today's session.</Callout>}

      {selectedDay && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <CardTitle style={{ margin: 0 }}>
              {DAY_TYPES.find(d => d.id === selectedDay)?.sub}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(true)}>+ Add exercise</Button>
          </div>

          {/* Header row */}
          <div
            className="grid gap-2 pb-2 text-[10px] font-mono"
            style={{ gridTemplateColumns: '1fr 70px 70px 70px 28px', color: 'var(--faint)', borderBottom: '1px solid var(--border)' }}
          >
            <span></span>
            <span className="text-center">Sets</span>
            <span className="text-center">Reps</span>
            <span className="text-center">kg</span>
            <span></span>
          </div>

          {(exercises[selectedDay] || []).map(ex => {
            const currentKg = sessionData[ex.id]?.weight_kg
            const isPR = isNewPR(ex.name, currentKg)
            return (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                onChange={(field, val) => handleChange(ex.id, field, val)}
                onEdit={(updates) => editExercise(ex.id, updates)}
                onDelete={() => deleteExercise(ex.id, selectedDay)}
                isPR={isPR}
              />
            )
          })}

          {/* PR legend */}
          <div className="mt-3 text-[11px]" style={{ color: 'var(--faint)' }}>
            <span className="font-mono font-medium px-1.5 py-0.5 rounded mr-1.5"
              style={{ background: 'var(--acc-dim)', color: 'var(--acc)' }}>PR</span>
            Personal record — new max weight for this exercise
          </div>
        </Card>
      )}

      {/* Previous PRs */}
      {selectedDay && (
        <Card>
          <CardTitle>Personal records — {selectedDay}</CardTitle>
          {(exercises[selectedDay] || []).map(ex => {
            const pr = getPR(ex.name)
            return (
              <div key={ex.id} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text)' }}>{ex.name}</span>
                <span className="font-mono text-sm" style={{ color: pr ? 'var(--acc)' : 'var(--faint)' }}>
                  {pr ? `${pr} kg` : '—'}
                </span>
              </div>
            )
          })}
        </Card>
      )}

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add exercise">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Exercise name</label>
            <input
              value={newExName}
              onChange={e => setNewExName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="e.g. Cable fly"
            />
          </div>
          <Button variant="accent" onClick={handleAddExercise} className="w-full justify-center">
            Add
          </Button>
        </div>
      </Modal>
    </div>
  )
}
