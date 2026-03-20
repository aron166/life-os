import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY, thisWeekDates, currentWeekNumber } from '../lib/dateUtils'
import { HABITS } from '../lib/constants'

export function useHabits(userId) {
  const [logs, setLogs]           = useState({})   // { habitId: boolean }
  const [streaks, setStreaks]      = useState({})   // { habitId: { streak, freeze_used_week } }
  const [weeklyLogs, setWeeklyLogs] = useState({}) // { date: { habitId: boolean } }
  const [loading, setLoading]     = useState(true)
  const today = TODAY()

  const fetchToday = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('habit_logs')
      .select('habit_id, done')
      .eq('user_id', userId)
      .eq('date', today)

    const map = {}
    data?.forEach(r => { map[r.habit_id] = r.done })
    setLogs(map)
  }, [userId, today])

  const fetchStreaks = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('habit_streaks')
      .select('habit_id, streak, freeze_used_week')
      .eq('user_id', userId)

    const map = {}
    data?.forEach(r => { map[r.habit_id] = { streak: r.streak, freeze_used_week: r.freeze_used_week } })
    setStreaks(map)
  }, [userId])

  const fetchWeekly = useCallback(async () => {
    if (!userId) return
    const dates = thisWeekDates()
    const { data } = await supabase
      .from('habit_logs')
      .select('date, habit_id, done')
      .eq('user_id', userId)
      .in('date', dates)

    const map = {}
    data?.forEach(r => {
      if (!map[r.date]) map[r.date] = {}
      map[r.date][r.habit_id] = r.done
    })
    setWeeklyLogs(map)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    Promise.all([fetchToday(), fetchStreaks(), fetchWeekly()])
  }, [userId, fetchToday, fetchStreaks, fetchWeekly])

  // Realtime subscription
  useEffect(() => {
    if (!userId) return
    const channel = supabase.channel('habits-' + userId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${userId}` },
        () => { fetchToday(); fetchWeekly() })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId, fetchToday, fetchWeekly])

  const toggle = async (habitId) => {
    const newDone = !logs[habitId]
    // Optimistic update
    setLogs(prev => ({ ...prev, [habitId]: newDone }))

    const { error } = await supabase.from('habit_logs').upsert({
      user_id: userId,
      date: today,
      habit_id: habitId,
      done: newDone,
    }, { onConflict: 'user_id,date,habit_id' })

    if (error) {
      console.error('[useHabits] toggle error:', error.message)
      // Revert on failure
      setLogs(prev => ({ ...prev, [habitId]: !newDone }))
      return
    }

    await updateStreak(habitId, newDone)
    fetchStreaks()
  }

  const updateStreak = async (habitId, done) => {
    const current = streaks[habitId]?.streak ?? 0
    const newStreak = done ? current + 1 : Math.max(0, current - 1)
    await supabase.from('habit_streaks').upsert({
      user_id: userId,
      habit_id: habitId,
      streak: newStreak,
    }, { onConflict: 'user_id,habit_id' })
  }

  const useFreeze = async (habitId) => {
    const weekNum = String(currentWeekNumber())
    const already = streaks[habitId]?.freeze_used_week === weekNum
    if (already) return { error: 'Freeze already used this week' }

    // Mark the habit as done via freeze
    setLogs(prev => ({ ...prev, [habitId]: true }))
    await supabase.from('habit_logs').upsert({
      user_id: userId, date: today, habit_id: habitId, done: true
    }, { onConflict: 'user_id,date,habit_id' })

    await supabase.from('habit_streaks').upsert({
      user_id: userId, habit_id: habitId,
      streak: streaks[habitId]?.streak ?? 0,
      freeze_used_week: weekNum,
    }, { onConflict: 'user_id,habit_id' })

    fetchStreaks()
    return { error: null }
  }

  const freezeUsedThisWeek = (habitId) => {
    const weekNum = String(currentWeekNumber())
    return streaks[habitId]?.freeze_used_week === weekNum
  }

  return { logs, streaks, weeklyLogs, loading, toggle, useFreeze, freezeUsedThisWeek }
}
