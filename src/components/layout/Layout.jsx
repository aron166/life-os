import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../hooks/useAuth'

export function Layout({ children }) {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar onSignOut={signOut} />
      </div>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="px-5 py-8 md:px-9 pb-24 md:pb-8"
          style={{ maxWidth: 900 }}
        >
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
