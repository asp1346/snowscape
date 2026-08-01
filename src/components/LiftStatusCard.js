import { liftStatusColor, liftStatusLabel } from '../lib/liftie.js'

export default function LiftStatusCard({ slug, liftStatus }) {
  const offSeason = liftStatus?.offSeason === true
  const hasData = liftStatus && !offSeason

  // Estimate next opening month — most PNW resorts open mid-November
  const nextOpen = 'mid-November'

  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <span className="font-display text-sm font-bold text-ink">Lift status</span>
        {hasData && (
          <span className="text-xs text-ink-faint">live</span>
        )}
      </div>

      {!slug && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Lift status isn&apos;t tracked for this resort yet.
        </div>
      )}

      {slug && offSeason && (
        <div className="px-6 py-8 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-ink-faint">
              <path d="M8 6.00067L21 6.00001M8 12.0007L21 12M8 18.0007L21 18M3 6H3.00898M3 12H3.00898M3 18H3.00898" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Lifts closed for summer</p>
            <p className="text-xs text-ink-faint mt-1">Ski season typically reopens {nextOpen}. Check back then for live lift status.</p>
          </div>
        </div>
      )}

      {slug && !liftStatus && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Lift status unavailable for this resort.
        </div>
      )}

      {hasData && (
        <div className="p-6">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="font-display text-4xl font-bold text-ink">{liftStatus.open}</span>
            <span className="text-lg text-ink-faint">/ {liftStatus.total} lifts open</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {liftStatus.breakdown.map(({ status, count }) => (
              <div key={status} className="bg-surface-2 border border-line rounded-xl p-3">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${liftStatusColor(status)}`} />
                  <span className="text-xs text-ink-muted">{liftStatusLabel(status)}</span>
                </div>
                <div className="font-display text-xl font-bold text-ink mt-1">{count}</div>
              </div>
            ))}
          </div>

          {liftStatus.lifts.length > 0 && (
            <div className="divide-y divide-line-2 border-t border-line -mx-6 px-6">
              {liftStatus.lifts.map(lift => (
                <div key={lift.name} className="flex items-center gap-3 py-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${liftStatusColor(lift.status)}`} />
                  <span className="text-sm text-ink-muted flex-1 truncate">{lift.name}</span>
                  <span className="text-xs text-ink-faint">{liftStatusLabel(lift.status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
