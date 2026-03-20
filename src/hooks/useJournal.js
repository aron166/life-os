import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY } from '../lib/dateUtils'

export function useJournal(userId) {
  const [entry, setEntry]       = useState({ worked: '', didnt: '', tomorrow: '', quick_note: '' })
  const [history, setHistory]   = useState([])
  const [tasks, setTasks]       = useState('')
  const [dayType, setDayTypeState] = useState(null)
  const [loading, setLoading]   = useState(true)
  const today = TODAY()

  const fetchToday = useCallback(async () => {
    if (!userId) return
    const [jRes, tRes, dRes] = await Promise.all([
      supabase.from('journal_entries').select('*').eq('user_id', userId).eq('date', today).single(),
      supabase.from('tasks').select('*').eq('user_id', userId).eq('date', today).single(),
      supabase.from('day_types').select('*').eq('user_id', userId).eq('date', today).single(),
    ])
    if (jRes.data) setEntry(jRes.data)
    if (tRes.data) setTasks(tRes.data.content || '')
    if (dRes.data) setDayTypeState(dRes.data.day_type)
    setLoading(false)
  }, [userId, today])

  const fetchHistory = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('journal_entries')
      .select('date, worked, didnt, tomorrow')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(14)
    setHistory(data || [])
  }, [userId])

  useEffect(() => {
    if (!userId) return
    Promise.all([fetchToday(), fetchHistory()])
  }, [userId, fetchToday, fetchHistory])

  const saveJournal = async (data) => {
    const updated = { ...entry, ...data }
    setEntry(updated)
    await supabase.from('journal_entries').upsert({
      user_id: userId, date: today, ...updated
    }, { onConflict: 'user_id,date' })
    fetchHistory()
  }

  const saveTasks = async (content) => {
    setTasks(content)
    await supabase.from('tasks').upsert({
      user_id: userId, date: today, content
    }, { onConflict: 'user_id,date' })
  }

  const saveDayType = async (type) => {
    setDayTypeState(type)
    await supabase.from('day_types').upsert({
      user_id: userId, date: today, day_type: type
    }, { onConflict: 'user_id,date' })
  }

  return { entry, history, tasks, dayType, loading, saveJournal, saveTasks, saveDayType }
}
