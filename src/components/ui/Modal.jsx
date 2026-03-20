import { useEffect } from 'react'

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-lg p-6 animate-slide-up"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-syne font-bold text-base" style={{ color: 'var(--text)' }}>{title}</h3>
            <button onClick={onClose} className="text-lg leading-none" style={{ color: 'var(--muted)' }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
