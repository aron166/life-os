export function SleepWidget({ todayLog, avgSleep, underSevenDays, onLog }) {
  return (
    <div
      className="rounded-lg p-5 mb-3.5"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
    >
      <div className="font-syne font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
        <span>◒</span> Sleep
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
          <div className="font-syne text-2xl font-bold" style={{ color: avgSleep && avgSleep < 7 ? 'var(--red)' : 'var(--text)' }}>
            {avgSleep ?? '—'}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Avg hrs this week</div>
        </div>
        <div className="rounded-card p-3 text-center" style={{ background: 'var(--bg3)' }}>
          <div className="font-syne text-2xl font-bold" style={{ color: underSevenDays > 0 ? 'var(--orange)' : 'var(--green)' }}>
            {todayLog?.duration_hours ? `${todayLog.duration_hours.toFixed(1)}h` : '—'}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>Last night</div>
        </div>
      </div>

      {underSevenDays > 0 && (
        <div className="text-xs px-3 py-2 rounded-card mb-3" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)' }}>
          ⚠ {underSevenDays} night{underSevenDays > 1 ? 's' : ''} under 7 hrs this week
        </div>
      )}

      <button
        onClick={onLog}
        className="w-full py-2.5 rounded-card text-sm text-center transition-all"
        style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
      >
        {todayLog ? `Logged: ${todayLog.bedtime} → ${todayLog.wake_time}` : '+ Log last night'}
      </button>
    </div>
  )
}
