import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY } from '../lib/dateUtils'
import { DEFAULT_EXERCISES } from '../lib/constants'

export function useGym(userId) {
  const [exercises, setExercises] = useState({ push: [], pull: [], legs: [] })
  const [todayLogs, setTodayLogs] = useState([])
  const [allLogs, setAllLogs]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [seeding, setSeeding]     = useState(false)
  const today = TODAY()

  const groupExercises = (data) => {
    const grouped = { push: [], pull: [], legs: [] }
    data.forEach(ex => { if (grouped[ex.day_type]) grouped[ex.day_type].push(ex) })
    return grouped
  }

  const fetchExercises = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('gym_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('order_index')

    if (error) {
      console.error('[useGym] fetch error:', error.message)
      setLoading(false)
      return
    }

    if (data && data.length > 0) {
      setExercises(groupExercises(data))
      setLoading(false)
      return
    }

    // No exercises yet — seed defaults
    setSeeding(true)
    const rows = []
    Object.entries(DEFAULT_EXERCISES).forEach(([dayType, exList]) => {
      exList.forEach((ex, i) => {
        rows.push({
          user_id: userId,
          day_type: dayType,
          name: ex.name,
          default_sets: ex.default_sets,
          default_reps: ex.default_reps,
          order_index: i,
        })
      })
    })

    const { error: seedErr } = await supabase.from('gym_exercises').insert(rows)
    if (seedErr) {
      console.error('[useGym] seed error:', seedErr.message)
      setSeeding(false)
      setLoading(false)
      return
    }

    // Refetch after seeding
    const { data: fresh, error: freshErr } = await supabase
      .from('gym_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('order_index')

    if (freshErr) {
      console.error('[useGym] post-seed fetch error:', freshErr.message)
    } else if (fresh) {
      setExercises(groupExercises(fresh))
    }
    setSeeding(false)
    setLoading(false)
  }, [userId])

  const fetchLogs = useCallback(async () => {
    if (!userId) return
    const [{ data: todayData }, { data: allData }] = await Promise.all([
      supabase.from('gym_logs').select('*').eq('user_id', userId).eq('date', today),
      supabase.from('gym_logs')
        .select('exercise_name, sets, reps, weight_kg, date, day_type')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
    ])
    setTodayLogs(todayData || [])
    setAllLogs(allData || [])
  }, [userId, today])

  useEffect(() => {
    if (!userId) return
    Promise.all([fetchExercises(), fetchLogs()])
  }, [userId, fetchExercises, fetchLogs])

  const saveSession = async (dayType, sessionData) => {
    const rows = sessionData
      .filter(d => d.weight_kg || d.sets || d.reps)
      .map(d => ({
        user_id: userId,
        date: today,
        exercise_name: d.exercise_name,
        sets:      d.sets      ? Number(d.sets)      : null,
        reps:      d.reps      ? Number(d.reps)      : null,
        weight_kg: d.weight_kg ? Number(d.weight_kg) : null,
        day_type:  dayType,
      }))
    if (rows.length === 0) return
    await supabase.from('gym_logs').delete().eq('user_id', userId).eq('date', today).eq('day_type', dayType)
    const { error } = await supabase.from('gym_logs').insert(rows)
    if (error) console.error('[useGym] saveSession error:', error.message)
    fetchLogs()
  }

  const addExercise = async (dayType, name) => {
    const list = exercises[dayType] || []
    const { data, error } = await supabase.from('gym_exercises').insert({
      user_id: userId, day_type: dayType, name, default_sets: 3, default_reps: 10, order_index: list.length
    }).select().single()
    if (error) { console.error('[useGym] addExercise error:', error.message); return }
    if (data) setExercises(prev => ({ ...prev, [dayType]: [...(prev[dayType] || []), data] }))
  }

  const editExercise = async (id, updates) => {
    const { error } = await supabase.from('gym_exercises').update(updates).eq('id', id)
    if (error) console.error('[useGym] editExercise error:', error.message)
    else fetchExercises()
  }

  const deleteExercise = async (id, dayType) => {
    await supabase.from('gym_exercises').delete().eq('id', id)
    setExercises(prev => ({ ...prev, [dayType]: prev[dayType].filter(e => e.id !== id) }))
  }

  const resetToDefaults = async () => {
    await supabase.from('gym_exercises').delete().eq('user_id', userId)
    setExercises({ push: [], pull: [], legs: [] })
    setLoading(true)
    fetchExercises()
  }

  const getPR = (exerciseName) => {
    const relevant = allLogs.filter(l => l.exercise_name === exerciseName && l.weight_kg)
    if (relevant.length === 0) return null
    return Math.max(...relevant.map(l => Number(l.weight_kg)))
  }

  const isNewPR = (exerciseName, weight) => {
    if (!weight) return false
    const pr = getPR(exerciseName)
    return pr !== null && Number(weight) > pr
  }

  return {
    exercises, todayLogs, allLogs, loading, seeding,
    saveSession, addExercise, editExercise, deleteExercise,
    resetToDefaults, getPR, isNewPR,
  }
}
