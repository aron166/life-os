import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY, thisWeekDates, sleepDuration } from '../lib/dateUtils'

export function useSleep(userId) {
  const [todayLog, setTodayLog] = useState(null)
  const [weekLogs, setWeekLogs] = useState([])
  const [loading, setLoading]   = useState(true)
  const today = TODAY()

  const fetchLogs = useCallback(async () => {
    if (!userId) return
    const dates = thisWeekDates()
    const { data } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .in('date', [...dates, today])
      .order('date', { ascending: false })

    const todayEntry = data?.find(l => l.date === today)
    setTodayLog(todayEntry || null)
    setWeekLogs(data || [])
    setLoading(false)
  }, [userId, today])

  useEffect(() => {
    if (userId) fetchLogs()
  }, [userId, fetchLogs])

  const logSleep = async ({ bedtime, wake_time }) => {
    const duration = sleepDuration(bedtime, wake_time)
    const row = { user_id: userId, date: today, bedtime, wake_time, duration_hours: duration }
    setTodayLog(row)
    await supabase.from('sleep_logs').upsert(row, { onConflict: 'user_id,date' })
    fetchLogs()
  }

  const avgSleep = () => {
    const valid = weekLogs.filter(l => l.duration_hours)
    if (valid.length === 0) return null
    return (valid.reduce((s, l) => s + l.duration_hours, 0) / valid.length).toFixed(1)
  }

  const underSevenDays = weekLogs.filter(l => l.duration_hours && l.duration_hours < 7).length

  return { todayLog, weekLogs, loading, logSleep, avgSleep: avgSleep(), underSevenDays }
}
