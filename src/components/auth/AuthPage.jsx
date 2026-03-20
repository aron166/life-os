import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function AuthPage() {
  const [mode, setMode]         = useState('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { signIn, signUp }      = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fn = mode === 'signin' ? signIn : signUp
    const err = await fn(email, password)
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-syne font-black text-3xl tracking-tight mb-1" style={{ color: 'var(--acc)' }}>
            LIFE OS
          </div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Áron's personal system</div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-lg p-6"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
        >
          <div className="font-syne font-bold text-base mb-5" style={{ color: 'var(--text)' }}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </div>

          {error && (
            <div
              className="rounded-card px-4 py-2.5 text-sm mb-4"
              style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)' }}
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="you@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 text-sm rounded-card"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-card text-sm font-medium transition-all disabled:opacity-50"
            style={{ background: 'var(--acc-dim)', border: '1px solid var(--acc2)', color: 'var(--acc)' }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="w-full mt-3 text-sm py-2"
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
