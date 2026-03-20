import { useState, useEffect } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Callout } from '../components/ui/Callout'
import { ExerciseRow } from '../components/gym/ExerciseRow'
import { Modal } from '../components/ui/Modal'
import { useGym } from '../hooks/useGym'

const DAY_TYPES = [
  { id: 'push', label: 'Push', sub: 'Chest · Shoulders · Triceps' },
  { id: 'pull', label: 'Pull', sub: 'Back · Biceps' },
  { id: 'legs', label: 'Legs', sub: 'Quads · Hamstrings · Calves' },
]

export default function Gym({ user }) {
  const {
    exercises, todayLogs, allLogs, loading,
    saveSession, addExercise, editExercise, deleteExercise,
    getPR, isNewPR,
  } = useGym(user?.id)

  const [selectedDay, setSelectedDay] = useState(null)
  // sessionData: { [exerciseId]: { sets, reps, weight_kg } }
  const [sessionData, setSessionData] = useState({})
  const [addModal, setAddModal]       = useState(false)
  const [newExName, setNewExName]     = useState('')
  const [saved, setSaved]             = useState(false)
  const [notes, setNotes]             = useState('')

  // Auto-select today's day type if already logged
  useEffect(() => {
    if (todayLogs.length > 0 && !selectedDay) {
      setSelectedDay(todayLogs[0].day_type)
    }
  }, [todayLogs])

  // When switching day, reset session data
  const selectDay = (dayId) => {
    setSelectedDay(dayId)
    setSessionData({})
    setSaved(false)
  }

  const handleChange = (exId, field, value) => {
    setSessionData(prev => ({
      ...prev,
      [exId]: { ...(prev[exId] || {}), [field]: value },
    }))
  }

  // Load last session weights for this day type
  const loadLastSession = () => {
    if (!selectedDay) return
    const exList = exercises[selectedDay] || []
    const prefilled = {}
    exList.forEach(ex => {
      const lastLog = allLogs
        .filter(l => l.exercise_name === ex.name && l.day_type === selectedDay && l.weight_kg)
        .sort((a, b) => b.date.localeCompare(a.date))[0]
      if (lastLog) {
        prefilled[ex.id] = {
          sets:      lastLog.sets      ? String(lastLog.sets)      : '',
          reps:      lastLog.reps      ? String(lastLog.reps)      : '',
          weight_kg: lastLog.weight_kg ? String(lastLog.weight_kg) : '',
        }
      }
    })
    setSessionData(prefilled)
  }

  const getLastWeight = (exerciseName) => {
    const logs = allLogs.filter(l => l.exercise_name === exerciseName && l.weight_kg)
    if (logs.length === 0) return null
    return logs.sort((a, b) => b.date.localeCompare(a.date))[0]?.weight_kg
  }

  const handleSave = async () => {
    if (!selectedDay) return
    const list = (exercises[selectedDay] || []).map(ex => ({
      exercise_name: ex.name,
      sets:      sessionData[ex.id]?.sets,
      reps:      sessionData[ex.id]?.reps,
      weight_kg: sessionData[ex.id]?.weight_kg,
    }))
    await saveSession(selectedDay, list)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAddExercise = async () => {
    if (!newExName.trim() || !selectedDay) return
    await addExercise(selectedDay, newExName.trim())
    setNewExName('')
    setAddModal(false)
  }

  const dayExercises = selectedDay ? (exercises[selectedDay] || []) : []
  const hasAnyData = Object.values(sessionData).some(v => v.sets || v.reps || v.weight_kg)

  // Last session date for this day type
  const lastSessionDate = selectedDay
    ? allLogs.filter(l => l.day_type === selectedDay).sort((a, b) => b.date.localeCompare(a.date))[0]?.date
    : null

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Gym log</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Log weights — track progressive overload</div>
        </div>
        {selectedDay && hasAnyData && (
          <Button variant="accent" onClick={handleSave}>
            {saved ? 'Saved ✓' : 'Save session'}
          </Button>
        )}
      </div>

      {/* Day type selector */}
      <div className="flex gap-2 flex-wrap mb-4">
        {DAY_TYPES.map(dt => (
          <button
            key={dt.id}
            onClick={() => selectDay(dt.id)}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: selectedDay === dt.id ? 'var(--acc-dim)' : 'var(--bg2)',
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
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {lastSessionDate && (
                <Button variant="ghost" size="sm" onClick={loadLastSession}>
                  ↩ Load last session ({lastSessionDate})
                </Button>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(true)}>
              + Add exercise
            </Button>
          </div>

          <Card>
            <CardTitle>
              {DAY_TYPES.find(d => d.id === selectedDay)?.label} — {DAY_TYPES.find(d => d.id === selectedDay)?.sub}
            </CardTitle>

            {dayExercises.length === 0 && (
              <div className="text-sm py-2" style={{ color: 'var(--faint)' }}>
                No exercises yet. Add one above.
              </div>
            )}

            {dayExercises.map(ex => {
              const currentKg = sessionData[ex.id]?.weight_kg
              const lastKg    = getLastWeight(ex.name)
              return (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  values={sessionData[ex.id] || {}}
                  onChange={(field, val) => handleChange(ex.id, field, val)}
                  onEdit={(updates) => editExercise(ex.id, updates)}
                  onDelete={() => deleteExercise(ex.id, selectedDay)}
                  isPR={isNewPR(ex.name, currentKg)}
                  lastWeight={lastKg}
                />
              )
            })}

            {/* Session notes */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--faint)' }}>Session notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-card"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical', minHeight: 60 }}
                placeholder="How did it feel? Anything to note for next time..."
              />
            </div>

            {/* Save button inside card too */}
            <div className="mt-4 flex justify-end">
              <Button variant="accent" onClick={handleSave} disabled={!hasAnyData}>
                {saved ? 'Saved ✓' : 'Save session'}
              </Button>
            </div>
          </Card>

          {/* Personal records */}
          <Card>
            <CardTitle>Personal records — {selectedDay}</CardTitle>
            {dayExercises.length === 0 ? (
              <div className="text-sm" style={{ color: 'var(--faint)' }}>No exercises yet.</div>
            ) : (
              dayExercises.map(ex => {
                const pr = getPR(ex.name)
                return (
                  <div key={ex.id} className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{ex.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px]" style={{ color: 'var(--faint)' }}>
                        {getLastWeight(ex.name) ? `last: ${getLastWeight(ex.name)}kg` : ''}
                      </span>
                      <span className="font-mono text-sm font-medium"
                        style={{ color: pr ? 'var(--acc)' : 'var(--faint)' }}>
                        {pr ? `${pr} kg PR` : '—'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </Card>
        </>
      )}

      {/* Add exercise modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add exercise">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Exercise name</label>
            <input
              value={newExName}
              onChange={e => setNewExName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
              autoFocus
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="e.g. Cable fly, Dumbbell press..."
            />
          </div>
          <Button variant="accent" onClick={handleAddExercise} className="w-full justify-center">
            Add to {selectedDay}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
