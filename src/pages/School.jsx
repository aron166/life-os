import { useState, useEffect, useCallback } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Modal } from '../components/ui/Modal'
import { supabase } from '../lib/supabase'

const STATUSES = ['todo', 'in_progress', 'done']
const STATUS_LABELS = { todo: 'To do', in_progress: 'In progress', done: 'Done' }
const STATUS_COLORS = { todo: 'var(--muted)', in_progress: 'var(--orange)', done: 'var(--green)' }

export default function School({ user }) {
  const [sprint, setSprint]         = useState({ sprint_name: '', sprint_start: '', sprint_end: '', mentor_notes: '', weekly_goal: '' })
  const [tasks, setTasks]           = useState([])
  const [submissions, setSubmissions] = useState([])
  const [newTask, setNewTask]       = useState('')
  const [newSub, setNewSub]         = useState({ title: '', date: '', notes: '' })
  const [subModal, setSubModal]     = useState(false)
  const [saved, setSaved]           = useState(false)

  const fetch = useCallback(async () => {
    if (!user?.id) return
    const [sprintRes, tasksRes, subRes] = await Promise.all([
      supabase.from('school_progress').select('*').eq('user_id', user.id).single(),
      supabase.from('school_tasks').select('*').eq('user_id', user.id).order('order_index'),
      supabase.from('school_submissions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
    ])
    if (sprintRes.data) setSprint(sprintRes.data)
    setTasks(tasksRes.data || [])
    setSubmissions(subRes.data || [])
  }, [user?.id])

  useEffect(() => { fetch() }, [fetch])

  const saveSprint = async () => {
    await supabase.from('school_progress').upsert({ user_id: user.id, ...sprint }, { onConflict: 'user_id' })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const addTask = async () => {
    if (!newTask.trim()) return
    const { data } = await supabase.from('school_tasks').insert({
      user_id: user.id, title: newTask.trim(), status: 'todo', order_index: tasks.length
    }).select().single()
    if (data) setTasks(p => [...p, data])
    setNewTask('')
  }

  const moveTask = async (id, status) => {
    await supabase.from('school_tasks').update({ status }).eq('id', id)
    setTasks(p => p.map(t => t.id === id ? { ...t, status } : t))
  }

  const deleteTask = async (id) => {
    await supabase.from('school_tasks').delete().eq('id', id)
    setTasks(p => p.filter(t => t.id !== id))
  }

  const addSubmission = async () => {
    const { data } = await supabase.from('school_submissions').insert({
      user_id: user.id, ...newSub
    }).select().single()
    if (data) setSubmissions(p => [data, ...p])
    setNewSub({ title: '', date: '', notes: '' })
    setSubModal(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>School</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Bootcamp progress tracker</div>
        </div>
        <Button variant="accent" onClick={saveSprint}>{saved ? 'Saved ✓' : 'Save'}</Button>
      </div>

      {/* Sprint info */}
      <Card>
        <CardTitle>Current sprint</CardTitle>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Sprint name</label>
            <input value={sprint.sprint_name || ''} onChange={e => setSprint(p => ({ ...p, sprint_name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="e.g. Sprint 4 — Authentication" />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Start date</label>
            <input type="date" value={sprint.sprint_start || ''} onChange={e => setSprint(p => ({ ...p, sprint_start: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>End date</label>
            <input type="date" value={sprint.sprint_end || ''} onChange={e => setSprint(p => ({ ...p, sprint_end: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Weekly goal</label>
          <input value={sprint.weekly_goal || ''} onChange={e => setSprint(p => ({ ...p, weekly_goal: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm rounded-card"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
            placeholder="What do you want to complete by Friday?" />
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Mentor notes</label>
          <textarea value={sprint.mentor_notes || ''} onChange={e => setSprint(p => ({ ...p, mentor_notes: e.target.value }))}
            className="journal-input" style={{ minHeight: 80 }}
            placeholder="Feedback from mentor, things to focus on..." />
        </div>
      </Card>

      {/* Kanban */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle style={{ margin: 0 }}>Task board</CardTitle>
          <div className="flex gap-2">
            <input value={newTask} onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              className="px-3 py-1.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', width: 180 }}
              placeholder="New task..." />
            <Button variant="accent" size="sm" onClick={addTask}>Add</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {STATUSES.map(status => {
            const col = tasks.filter(t => t.status === status)
            return (
              <div key={status}
                className="rounded-card p-3 min-h-[120px]"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-medium mb-3 flex items-center gap-1.5"
                  style={{ color: STATUS_COLORS[status] }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                  {STATUS_LABELS[status]} ({col.length})
                </div>
                {col.map(task => (
                  <div key={task.id}
                    className="rounded-card p-2.5 mb-2 text-xs group"
                    style={{ background: 'var(--bg4)', border: '1px solid var(--border)' }}>
                    <div className="mb-1.5" style={{ color: 'var(--text)' }}>{task.title}</div>
                    <div className="flex gap-1 flex-wrap">
                      {STATUSES.filter(s => s !== status).map(s => (
                        <button key={s} onClick={() => moveTask(task.id, s)}
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--bg2)', color: 'var(--muted)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                          → {STATUS_LABELS[s]}
                        </button>
                      ))}
                      <button onClick={() => deleteTask(task.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded ml-auto"
                        style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </Card>

      {/* PR / Submission log */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <CardTitle style={{ margin: 0 }}>PR / Submission log</CardTitle>
          <Button variant="accent" size="sm" onClick={() => setSubModal(true)}>+ Add</Button>
        </div>
        {submissions.length === 0 && (
          <div className="text-sm" style={{ color: 'var(--faint)' }}>No submissions yet.</div>
        )}
        {submissions.map(s => (
          <div key={s.id} className="py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px]" style={{ color: 'var(--acc)' }}>{s.date}</span>
              <span className="text-sm" style={{ color: 'var(--text)' }}>{s.title}</span>
            </div>
            {s.notes && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.notes}</div>}
          </div>
        ))}
      </Card>

      <Modal open={subModal} onClose={() => setSubModal(false)} title="Add submission">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Title / PR name</label>
            <input value={newSub.title} onChange={e => setNewSub(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Date</label>
            <input type="date" value={newSub.date} onChange={e => setNewSub(p => ({ ...p, date: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Notes</label>
            <textarea value={newSub.notes} onChange={e => setNewSub(p => ({ ...p, notes: e.target.value }))}
              className="journal-input" style={{ minHeight: 60 }} />
          </div>
          <Button variant="accent" onClick={addSubmission} className="w-full justify-center">Add submission</Button>
        </div>
      </Modal>
    </div>
  )
}
