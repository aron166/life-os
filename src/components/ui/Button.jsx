export function Button({ children, onClick, variant = 'default', className = '', disabled, type = 'button', size = 'md' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-card border font-sans cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  }

  const variants = {
    default: {
      background: 'transparent',
      border: '1px solid var(--border2)',
      color: 'var(--text)',
    },
    accent: {
      background: 'var(--acc-dim)',
      border: '1px solid var(--acc2)',
      color: 'var(--acc)',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid transparent',
      color: 'var(--muted)',
    },
    danger: {
      background: 'var(--red-dim)',
      border: '1px solid var(--red)',
      color: 'var(--red)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${className}`}
      style={variants[variant]}
    >
      {children}
    </button>
  )
}
