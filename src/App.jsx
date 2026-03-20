import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthPage } from './components/auth/AuthPage'
import { Layout } from './components/layout/Layout'
import Today from './pages/Today'
import Schedule from './pages/Schedule'
import Habits from './pages/Habits'
import Gym from './pages/Gym'
import Nutrition from './pages/Nutrition'
import Journal from './pages/Journal'
import Focus from './pages/Focus'
import School from './pages/School'
import Business from './pages/Business'
import WeeklyReview from './pages/WeeklyReview'
import Sleep from './pages/Sleep'
import WeeklyPlanner from './pages/WeeklyPlanner'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="font-syne font-black text-2xl animate-pulse-slow" style={{ color: 'var(--acc)' }}>
        LIFE OS
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <AuthPage />

  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Today user={user} />} />
        <Route path="/schedule"  element={<Schedule user={user} />} />
        <Route path="/habits"    element={<Habits user={user} />} />
        <Route path="/gym"       element={<Gym user={user} />} />
        <Route path="/nutrition" element={<Nutrition user={user} />} />
        <Route path="/journal"   element={<Journal user={user} />} />
        <Route path="/focus"     element={<Focus />} />
        <Route path="/school"    element={<School user={user} />} />
        <Route path="/business"  element={<Business user={user} />} />
        <Route path="/review"    element={<WeeklyReview user={user} />} />
        <Route path="/sleep"     element={<Sleep user={user} />} />
        <Route path="/planner"   element={<WeeklyPlanner user={user} />} />
      </Routes>
    </Layout>
  )
}
