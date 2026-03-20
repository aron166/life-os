import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ExerciseRow({ exercise, values, onChange, onEdit, onDelete, isPR, lastWeight }) {
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(exercise.name)
  const [editSets, setEditSets] = useState(exercise.default_sets)
  const [editReps, setEditReps] = useState(exercise.default_reps)

  const saveEdit = () => {
    onEdit({ name: editName, default_sets: Number(editSets), default_reps: Number(editReps) })
    setEditOpen(false)
  }

  return (
    <>
      <div
        className="py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Exercise name + actions */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {exercise.name}
            </span>
            {isPR && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium flex-shrink-0"
                style={{ background: 'var(--acc-dim)', color: 'var(--acc)', border: '1px solid var(--acc2)' }}
              >
                🏆 PR
              </span>
            )}
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                setEditName(exercise.name)
                setEditSets(exercise.default_sets)
                setEditReps(exercise.default_reps)
                setEditOpen(true)
              }}
              className="text-xs px-2.5 py-1 rounded-card transition-all"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', minHeight: 32 }}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs px-2 py-1 rounded-card transition-all"
              style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer', minHeight: 32 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div>
            <div className="text-[10px] font-mono text-center mb-1" style={{ color: 'var(--faint)' }}>Sets</div>
            <input
              className="gym-input"
              type="number"
              min="1"
              value={values?.sets ?? ''}
              placeholder={String(exercise.default_sets)}
              onChange={e => onChange('sets', e.target.value)}
            />
          </div>
          <div>
            <div className="text-[10px] font-mono text-center mb-1" style={{ color: 'var(--faint)' }}>Reps</div>
            <input
              className="gym-input"
              type="number"
              min="1"
              value={values?.reps ?? ''}
              placeholder={String(exercise.default_reps)}
              onChange={e => onChange('reps', e.target.value)}
            />
          </div>
          <div>
            <div className="text-[10px] font-mono text-center mb-1" style={{ color: 'var(--faint)' }}>
              kg {lastWeight ? <span style={{ color: 'var(--faint)' }}>({lastWeight} last)</span> : ''}
            </div>
            <input
              className="gym-input"
              type="number"
              min="0"
              step="0.5"
              value={values?.weight_kg ?? ''}
              placeholder={lastWeight ? String(lastWeight) : '—'}
              onChange={e => onChange('weight_kg', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`Edit — ${exercise.name}`}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Exercise name</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Default sets</label>
              <input
                type="number" value={editSets} onChange={e => setEditSets(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-card"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Default reps</label>
              <input
                type="number" value={editReps} onChange={e => setEditReps(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-card"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between pt-1">
            <Button variant="danger" onClick={() => { onDelete(); setEditOpen(false) }} size="sm">
              Delete exercise
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditOpen(false)} size="sm">Cancel</Button>
              <Button variant="accent" onClick={saveEdit} size="sm">Save changes</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
