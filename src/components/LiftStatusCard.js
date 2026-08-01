import { liftStatusColor, liftStatusLabel } from '../lib/liftie.js'

export default function LiftStatusCard({ slug, liftStatus }) {
  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <span className="font-display text-sm font-bold text-ink">Lift status</span>
        {liftStatus && (
          <span className="text-xs text-ink-faint">via Liftie</span>
        )}
      </div>

      {!slug && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Lift status isn&apos;t tracked for this resort yet.
        </div>
      )}

      {slug && !liftStatus && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Unable to load lift status right now.
        </div>
      )}

      {liftStatus && (
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
