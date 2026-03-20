import { useState, useEffect, useCallback } from 'react'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { supabase } from '../lib/supabase'
import { weekStart } from '../lib/dateUtils'

const CLIENT_STATUSES = ['active', 'paused', 'completed']
const PROSPECT_STATUSES = ['new', 'contacted', 'in_talks', 'closed']
const STATUS_COLORS = {
  active: 'var(--green)', paused: 'var(--orange)', completed: 'var(--muted)',
  new: 'var(--muted)', contacted: 'var(--blue)', in_talks: 'var(--orange)', closed: 'var(--green)',
}

export default function Business({ user }) {
  const [clients, setClients]       = useState([])
  const [prospects, setProspects]   = useState([])
  const [config, setConfig]         = useState({ weekly_revenue_goal: 0, weekly_revenue_actual: 0, current_build: '', ideas_backlog: '' })
  const [clientModal, setClientModal] = useState(false)
  const [prospectModal, setProspectModal] = useState(false)
  const [newClient, setNewClient]   = useState({ name: '', status: 'active', next_action: '' })
  const [newProspect, setNewProspect] = useState({ name: '', contact_date: '', status: 'new' })
  const [saved, setSaved]           = useState(false)

  const fetch = useCallback(async () => {
    if (!user?.id) return
    const [cRes, pRes, cfRes] = await Promise.all([
      supabase.from('business_clients').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('business_prospects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('business_config').select('*').eq('user_id', user.id).single(),
    ])
    setClients(cRes.data || [])
    setProspects(pRes.data || [])
    if (cfRes.data) setConfig(cfRes.data)
  }, [user?.id])

  useEffect(() => { fetch() }, [fetch])

  const saveConfig = async () => {
    await supabase.from('business_config').upsert({
      user_id: user.id, ...config, week_start: weekStart()
    }, { onConflict: 'user_id' })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const addClient = async () => {
    const { data } = await supabase.from('business_clients').insert({ user_id: user.id, ...newClient }).select().single()
    if (data) setClients(p => [data, ...p])
    setNewClient({ name: '', status: 'active', next_action: '' }); setClientModal(false)
  }

  const updateClient = async (id, updates) => {
    await supabase.from('business_clients').update(updates).eq('id', id)
    setClients(p => p.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const deleteClient = async (id) => {
    await supabase.from('business_clients').delete().eq('id', id)
    setClients(p => p.filter(c => c.id !== id))
  }

  const addProspect = async () => {
    const { data } = await supabase.from('business_prospects').insert({ user_id: user.id, ...newProspect }).select().single()
    if (data) setProspects(p => [data, ...p])
    setNewProspect({ name: '', contact_date: '', status: 'new' }); setProspectModal(false)
  }

  const updateProspect = async (id, updates) => {
    await supabase.from('business_prospects').update(updates).eq('id', id)
    setProspects(p => p.map(pr => pr.id === id ? { ...pr, ...updates } : pr))
  }

  const deleteProspect = async (id) => {
    await supabase.from('business_prospects').delete().eq('id', id)
    setProspects(p => p.filter(pr => pr.id !== id))
  }

  const revenueProgress = config.weekly_revenue_goal > 0
    ? Math.min(100, Math.round((config.weekly_revenue_actual / config.weekly_revenue_goal) * 100))
    : 0

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-syne font-bold text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Business</h1>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>AI automation agency tracker</div>
        </div>
        <Button variant="accent" onClick={saveConfig}>{saved ? 'Saved ✓' : 'Save'}</Button>
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-2 gap-3 mb-3.5">
        <Card className="mb-0">
          <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Weekly goal (€)</label>
          <input type="number" value={config.weekly_revenue_goal}
            onChange={e => setConfig(p => ({ ...p, weekly_revenue_goal: Number(e.target.value) }))}
            className="w-full px-3 py-2 text-sm rounded-card"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </Card>
        <Card className="mb-0">
          <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Actual this week (€)</label>
          <input type="number" value={config.weekly_revenue_actual}
            onChange={e => setConfig(p => ({ ...p, weekly_revenue_actual: Number(e.target.value) }))}
            className="w-full px-3 py-2 text-sm rounded-card"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </Card>
      </div>

      {config.weekly_revenue_goal > 0 && (
        <div className="mb-3.5 rounded-card p-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--muted)' }}>
            <span>Revenue progress</span>
            <span style={{ color: revenueProgress >= 100 ? 'var(--green)' : 'var(--acc)' }}>
              €{config.weekly_revenue_actual} / €{config.weekly_revenue_goal} ({revenueProgress}%)
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--bg4)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${revenueProgress}%`, background: revenueProgress >= 100 ? 'var(--green)' : 'var(--acc)' }} />
          </div>
        </div>
      )}

      {/* Current build + ideas */}
      <div className="grid md:grid-cols-2 gap-3.5">
        <Card>
          <CardTitle>What I'm building this week</CardTitle>
          <textarea value={config.current_build || ''} onChange={e => setConfig(p => ({ ...p, current_build: e.target.value }))}
            className="journal-input" style={{ minHeight: 80 }}
            placeholder="The specific thing you're building or shipping this week..." />
        </Card>
        <Card>
          <CardTitle>Ideas backlog</CardTitle>
          <textarea value={config.ideas_backlog || ''} onChange={e => setConfig(p => ({ ...p, ideas_backlog: e.target.value }))}
            className="journal-input" style={{ minHeight: 80 }}
            placeholder="Services, automations, content ideas, experiments..." />
        </Card>
      </div>

      {/* Active clients */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle style={{ margin: 0 }}>Active clients</CardTitle>
          <Button variant="accent" size="sm" onClick={() => setClientModal(true)}>+ Add client</Button>
        </div>
        {clients.length === 0 && <div className="text-sm" style={{ color: 'var(--faint)' }}>No clients yet.</div>}
        {clients.map(c => (
          <div key={c.id} className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{c.name}</span>
              <div className="flex items-center gap-2">
                <select
                  value={c.status}
                  onChange={e => updateClient(c.id, { status: e.target.value })}
                  className="text-[11px] px-2 py-1 rounded"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: STATUS_COLORS[c.status] }}
                >
                  {CLIENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => deleteClient(c.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
            {c.next_action && <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>→ {c.next_action}</div>}
            <input value={c.next_action || ''} onChange={e => updateClient(c.id, { next_action: e.target.value })}
              className="w-full mt-1.5 px-2 py-1 text-xs rounded"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              placeholder="Next action..." />
          </div>
        ))}
      </Card>

      {/* Prospect pipeline */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle style={{ margin: 0 }}>Prospect pipeline</CardTitle>
          <Button variant="accent" size="sm" onClick={() => setProspectModal(true)}>+ Add prospect</Button>
        </div>
        {prospects.length === 0 && <div className="text-sm" style={{ color: 'var(--faint)' }}>No prospects yet. Start outreach.</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {PROSPECT_STATUSES.map(s => (
            <div key={s} className="text-center py-1.5 rounded-card" style={{ background: 'var(--bg3)' }}>
              <div className="font-syne font-bold text-lg" style={{ color: STATUS_COLORS[s] }}>
                {prospects.filter(p => p.status === s).length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--faint)' }}>{s.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
        {prospects.map(p => (
          <div key={p.id} className="py-2.5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex-1">
              <span className="text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
              {p.contact_date && <span className="text-[11px] ml-2 font-mono" style={{ color: 'var(--faint)' }}>{p.contact_date}</span>}
            </div>
            <select value={p.status} onChange={e => updateProspect(p.id, { status: e.target.value })}
              className="text-[11px] px-2 py-1 rounded"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: STATUS_COLORS[p.status] }}>
              {PROSPECT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <button onClick={() => deleteProspect(p.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
      </Card>

      <Modal open={clientModal} onClose={() => setClientModal(false)} title="Add client">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Client name</label>
            <input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Next action</label>
            <input value={newClient.next_action} onChange={e => setNewClient(p => ({ ...p, next_action: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <Button variant="accent" onClick={addClient} className="w-full justify-center">Add client</Button>
        </div>
      </Modal>

      <Modal open={prospectModal} onClose={() => setProspectModal(false)} title="Add prospect">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Name / Company</label>
            <input value={newProspect.name} onChange={e => setNewProspect(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>First contact date</label>
            <input type="date" value={newProspect.contact_date} onChange={e => setNewProspect(p => ({ ...p, contact_date: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <Button variant="accent" onClick={addProspect} className="w-full justify-center">Add prospect</Button>
        </div>
      </Modal>
    </div>
  )
}
