import { useState, useEffect, useRef } from 'react'

const WORK_SECS  = 90 * 60
const BREAK_SECS = 15 * 60

function playBeep(ctx, freq = 440, duration = 0.3) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

function softChime(ctx) {
  playBeep(ctx, 523, 0.4)  // C5
  setTimeout(() => playBeep(ctx, 659, 0.4), 180) // E5
  setTimeout(() => playBeep(ctx, 784, 0.6), 360) // G5
}

export function FocusTimer() {
  const [phase, setPhase]     = useState('idle')   // idle | work | break
  const [secs, setSecs]       = useState(WORK_SECS)
  const [block, setBlock]     = useState(1)
  const intervalRef           = useRef(null)
  const audioCtxRef           = useRef(null)

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  useEffect(() => {
    if (phase === 'idle') {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSecs(prev => {
        if (prev <= 1) {
          // Switch phase
          const ctx = getAudioCtx()
          softChime(ctx)
          if (phase === 'work') {
            setPhase('break')
            return BREAK_SECS
          } else {
            setBlock(b => b + 1)
            setPhase('work')
            return WORK_SECS
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [phase])

  const start = () => {
    getAudioCtx() // init on user gesture
    setPhase('work')
    setSecs(WORK_SECS)
    setBlock(1)
  }

  const stop = () => {
    setPhase('idle')
    setSecs(WORK_SECS)
  }

  const mins = String(Math.floor(secs / 60)).padStart(2, '0')
  const s    = String(secs % 60).padStart(2, '0')
  const total    = phase === 'work' ? WORK_SECS : BREAK_SECS
  const progress = ((total - secs) / total) * 100

  const radius    = 54
  const circ      = 2 * Math.PI * radius
  const dashOffset = circ - (progress / 100) * circ

  return (
    <div
      className="rounded-lg p-5"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
    >
      <div className="font-syne font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span>⊙</span> Focus timer
        {phase !== 'idle' && (
          <span className="text-[11px] font-mono ml-auto" style={{ color: 'var(--muted)' }}>
            Block {block}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Ring */}
        <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--bg4)" strokeWidth="6" />
            <circle
              cx="64" cy="64" r={radius} fill="none"
              stroke={phase === 'break' ? 'var(--blue)' : 'var(--acc)'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={phase === 'idle' ? circ : dashOffset}
              className="timer-ring"
            />
          </svg>
          <div className="absolute text-center">
            <div className="font-mono text-2xl font-medium" style={{ color: 'var(--text)' }}>
              {mins}:{s}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: phase === 'break' ? 'var(--blue)' : 'var(--acc)' }}>
              {phase === 'idle' ? 'ready' : phase === 'work' ? 'work' : 'break'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {phase === 'idle' ? (
            <button
              onClick={start}
              className="px-6 py-2.5 rounded-card text-sm font-medium transition-all"
              style={{ background: 'var(--acc-dim)', border: '1px solid var(--acc2)', color: 'var(--acc)', cursor: 'pointer' }}
            >
              Start 90/15
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-6 py-2.5 rounded-card text-sm transition-all"
              style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer' }}
            >
              Stop
            </button>
          )}
        </div>

        <p className="text-[11px] text-center" style={{ color: 'var(--faint)' }}>
          90 min work → 15 min break → repeat
        </p>
      </div>
    </div>
  )
}
