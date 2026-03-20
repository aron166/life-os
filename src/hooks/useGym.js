import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY } from '../lib/dateUtils'
import { DEFAULT_EXERCISES } from '../lib/constants'

export function useGym(userId) {
  const [exercises, setExercises] = useState({ push: [], pull: [], legs: [] })
  const [todayLogs, setTodayLogs] = useState([])   // [{exercise_name, sets, reps, weight_kg, day_type}]
  const [allLogs, setAllLogs]     = useState([])   // all history for PR tracking
  const [loading, setLoading]     = useState(true)
  const today = TODAY()

  const fetchExercises = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('gym_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('order_index')

    if (data && data.length > 0) {
      const grouped = { push: [], pull: [], legs: [] }
      data.forEach(ex => { if (grouped[ex.day_type]) grouped[ex.day_type].push(ex) })
      setExercises(grouped)
    } else {
      // Seed default exercises for new user
      await seedDefaults()
    }
  }, [userId])

  const seedDefaults = async () => {
    const rows = []
    Object.entries(DEFAULT_EXERCISES).forEach(([dayType, exList]) => {
      exList.forEach((ex, i) => {
        rows.push({ user_id: userId, day_type: dayType, name: ex.name, default_sets: ex.default_sets, default_reps: ex.default_reps, order_index: i })
      })
    })
    await supabase.from('gym_exercises').insert(rows)
    fetchExercises()
  }

  const fetchLogs = useCallback(async () => {
    if (!userId) return
    const { data: todayData } = await supabase
      .from('gym_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)

    const { data: allData } = await supabase
      .from('gym_logs')
      .select('exercise_name, sets, reps, weight_kg, date, day_type')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    setTodayLogs(todayData || [])
    setAllLogs(allData || [])
    setLoading(false)
  }, [userId, today])

  useEffect(() => {
    if (!userId) return
    Promise.all([fetchExercises(), fetchLogs()])
  }, [userId, fetchExercises, fetchLogs])

  const saveSession = async (dayType, sessionData) => {
    // sessionData: [{ exercise_name, sets, reps, weight_kg }]
    const rows = sessionData
      .filter(d => d.weight_kg || d.sets || d.reps)
      .map(d => ({
        user_id: userId,
        date: today,
        exercise_name: d.exercise_name,
        sets: d.sets ? Number(d.sets) : null,
        reps: d.reps ? Number(d.reps) : null,
        weight_kg: d.weight_kg ? Number(d.weight_kg) : null,
        day_type: dayType,
      }))

    if (rows.length === 0) return

    // Delete today's logs for this day type first, then re-insert
    await supabase.from('gym_logs').delete().eq('user_id', userId).eq('date', today).eq('day_type', dayType)
    await supabase.from('gym_logs').insert(rows)
    fetchLogs()
  }

  const addExercise = async (dayType, name) => {
    const list = exercises[dayType] || []
    const { data } = await supabase.from('gym_exercises').insert({
      user_id: userId, day_type: dayType, name, default_sets: 3, default_reps: 10, order_index: list.length
    }).select().single()
    if (data) {
      setExercises(prev => ({ ...prev, [dayType]: [...(prev[dayType] || []), data] }))
    }
  }

  const editExercise = async (id, updates) => {
    await supabase.from('gym_exercises').update(updates).eq('id', id)
    fetchExercises()
  }

  const deleteExercise = async (id, dayType) => {
    await supabase.from('gym_exercises').delete().eq('id', id)
    setExercises(prev => ({ ...prev, [dayType]: prev[dayType].filter(e => e.id !== id) }))
  }

  // Returns the personal record (max kg) for an exercise
  const getPR = (exerciseName) => {
    const logs = allLogs.filter(l => l.exercise_name === exerciseName && l.weight_kg)
    if (logs.length === 0) return null
    return Math.max(...logs.map(l => l.weight_kg))
  }

  const isNewPR = (exerciseName, weight) => {
    if (!weight) return false
    const pr = getPR(exerciseName)
    return pr !== null && Number(weight) > pr
  }

  // Gym sessions this week (from habit logs)
  const gymSessionsThisWeek = todayLogs.length > 0 ? 1 : 0

  return { exercises, todayLogs, allLogs, loading, saveSession, addExercise, editExercise, deleteExercise, getPR, isNewPR }
}
