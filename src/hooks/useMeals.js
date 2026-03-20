import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TODAY } from '../lib/dateUtils'

export function useMeals(userId) {
  const [meals, setMeals]   = useState([])   // today's meal logs
  const [history, setHistory] = useState([]) // last 7 days
  const [loading, setLoading] = useState(true)
  const today = TODAY()

  const fetchToday = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .order('meal_number')
    setMeals(data || [])
    setLoading(false)
  }, [userId, today])

  const fetchHistory = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .neq('date', today)
      .order('date', { ascending: false })
      .order('meal_number')
      .limit(21) // 7 days × 3 meals
    setHistory(data || [])
  }, [userId, today])

  useEffect(() => {
    if (userId) Promise.all([fetchToday(), fetchHistory()])
  }, [userId, fetchToday, fetchHistory])

  const getMeal = (mealNumber) => meals.find(m => m.meal_number === mealNumber)

  const saveMeal = async (mealNumber, updates) => {
    // Optimistic update
    setMeals(prev => {
      const exists = prev.find(m => m.meal_number === mealNumber)
      if (exists) return prev.map(m => m.meal_number === mealNumber ? { ...m, ...updates } : m)
      return [...prev, { meal_number: mealNumber, ...updates }]
    })

    await supabase.from('meal_logs').upsert({
      user_id: userId,
      date: today,
      meal_number: mealNumber,
      ...updates,
    }, { onConflict: 'user_id,date,meal_number' })

    fetchHistory()
  }

  const toggleMeal = (mealNumber) => {
    const current = getMeal(mealNumber)
    saveMeal(mealNumber, { done: !current?.done })
  }

  // Total protein logged today
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein_g || 0), 0)

  return { meals, history, loading, getMeal, saveMeal, toggleMeal, totalProtein }
}
