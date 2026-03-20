import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ExerciseRow({ exercise, onChange, onEdit, onDelete, isPR }) {
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
        className="grid gap-2 py-2 items-center"
        style={{
          gridTemplateColumns: '1fr 70px 70px 70px 28px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm" style={{ color: 'var(--text)' }}>{exercise.name}</span>
          {isPR && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium"
              style={{ background: 'var(--acc-dim)', color: 'var(--acc)', border: '1px solid var(--acc2)' }}
            >
              PR
            </span>
          )}
        </div>
        <input
          className="gym-input"
          placeholder={String(exercise.default_sets)}
          onChange={e => onChange('sets', e.target.value)}
        />
        <input
          className="gym-input"
          placeholder={String(exercise.default_reps)}
          onChange={e => onChange('reps', e.target.value)}
        />
        <input
          className="gym-input"
          placeholder="kg"
          onChange={e => onChange('weight_kg', e.target.value)}
        />
        <button
          onClick={() => { setEditName(exercise.name); setEditSets(exercise.default_sets); setEditReps(exercise.default_reps); setEditOpen(true) }}
          className="text-[11px] flex items-center justify-center"
          style={{ background: 'none', border: 'none', color: 'var(--faint)', cursor: 'pointer', minHeight: 44 }}
          title="Edit exercise"
        >
          ✎
        </button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit exercise">
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
          <div className="flex gap-2 justify-between pt-2">
            <Button variant="danger" onClick={() => { onDelete(); setEditOpen(false) }} size="sm">Delete</Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditOpen(false)} size="sm">Cancel</Button>
              <Button variant="accent" onClick={saveEdit} size="sm">Save</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
