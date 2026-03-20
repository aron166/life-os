import { format, startOfWeek, endOfWeek, addDays, differenceInHours, parseISO } from 'date-fns'

export const TODAY = () => format(new Date(), 'yyyy-MM-dd')

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const formatDate = (date = new Date()) =>
  format(date, 'EEEE, d MMMM yyyy')

export const formatShort = (date = new Date()) =>
  format(date, 'EEE d MMM')

export const weekStart = (date = new Date()) =>
  format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')

export const weekEnd = (date = new Date()) =>
  format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')

export const thisWeekDates = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(monday, i), 'yyyy-MM-dd')
  )
}

export const isSunday = () => new Date().getDay() === 0

// Calculate sleep duration given bedtime (HH:MM) and wake time (HH:MM)
// Handles crossing midnight
export const sleepDuration = (bedtime, wakeTime) => {
  if (!bedtime || !wakeTime) return null
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  let bedMins = bh * 60 + bm
  let wakeMins = wh * 60 + wm
  if (wakeMins <= bedMins) wakeMins += 24 * 60 // crossed midnight
  return (wakeMins - bedMins) / 60
}

export const currentWeekNumber = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
