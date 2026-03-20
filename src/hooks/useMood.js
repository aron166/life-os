import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY, thisWeekDates } from '../lib/dateUtils'

export function useMood(userId) {
  const [todayMood, setTodayMood] = useState(null)
  const [weekMoods, setWeekMoods] = useState([])
  const today = TODAY()

  const fetchMoods = useCallback(async () => {
    if (!userId) return
    const dates = thisWeekDates()
    const { data } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .in('date', [...dates, today])
      .order('date', { ascending: false })

    const todayEntry = data?.find(l => l.date === today)
    setTodayMood(todayEntry?.mood_level ?? null)
    setWeekMoods(data || [])
  }, [userId, today])

  useEffect(() => {
    if (userId) fetchMoods()
  }, [userId, fetchMoods])

  const logMood = async (level) => {
    setTodayMood(level)
    await supabase.from('mood_logs').upsert({
      user_id: userId, date: today, mood_level: level
    }, { onConflict: 'user_id,date' })
  }

  return { todayMood, weekMoods, logMood }
}
