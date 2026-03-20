export function SectionLabel({ children, className = '' }) {
  return (
    <div
      className={`text-[10px] font-medium tracking-widest uppercase mb-2.5 mt-5 first:mt-0 ${className}`}
      style={{ color: 'var(--faint)' }}
    >
      {children}
    </div>
  )
}
