import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { thisWeekDates } from '../lib/dateUtils'

export function useWeeklyPlan(userId) {
  const [weekPlan, setWeekPlan] = useState({}) // { 'yyyy-MM-dd': 'team' | 'bar' | ... }
  const [loading, setLoading]   = useState(true)

  const fetchWeek = useCallback(async () => {
    if (!userId) return
    const dates = thisWeekDates()
    const { data } = await supabase
      .from('day_types')
      .select('date, day_type')
      .eq('user_id', userId)
      .in('date', dates)

    const map = {}
    data?.forEach(r => { map[r.date] = r.day_type })
    setWeekPlan(map)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetchWeek()
  }, [userId, fetchWeek])

  const setPlan = async (date, type) => {
    // Optimistic update
    setWeekPlan(prev => ({ ...prev, [date]: type || null }))
    if (!type) {
      await supabase.from('day_types').delete().eq('user_id', userId).eq('date', date)
    } else {
      const { error } = await supabase.from('day_types').upsert({
        user_id: userId, date, day_type: type,
      }, { onConflict: 'user_id,date' })
      if (error) {
        console.error('[useWeeklyPlan] setPlan error:', error.message)
        fetchWeek() // revert on error
      }
    }
  }

  return { weekPlan, loading, setPlan }
}
