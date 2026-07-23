import { liftStatusColor, liftStatusLabel } from '../lib/liftie.js'

export default function LiftStatusCard({ slug, liftStatus }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <span className="text-sm font-medium text-white">Lift status</span>
        {liftStatus && (
          <span className="text-xs text-neutral-500">via Liftie</span>
        )}
      </div>

      {!slug && (
        <div className="px-6 py-8 text-sm text-neutral-500">
          Lift status isn&apos;t tracked for this resort yet.
        </div>
      )}

      {slug && !liftStatus && (
        <div className="px-6 py-8 text-sm text-neutral-500">
          Unable to load lift status right now.
        </div>
      )}

      {liftStatus && (
        <div className="p-6">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-4xl font-semibold text-white">{liftStatus.open}</span>
            <span className="text-lg text-neutral-500">/ {liftStatus.total} lifts open</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {liftStatus.breakdown.map(({ status, count }) => (
              <div key={status} className="bg-neutral-800/50 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${liftStatusColor(status)}`} />
                  <span className="text-xs text-neutral-400">{liftStatusLabel(status)}</span>
                </div>
                <div className="text-xl font-semibold text-white mt-1">{count}</div>
              </div>
            ))}
          </div>

          {liftStatus.lifts.length > 0 && (
            <div className="divide-y divide-neutral-800/60 border-t border-neutral-800 -mx-6 px-6">
              {liftStatus.lifts.map(lift => (
                <div key={lift.name} className="flex items-center gap-3 py-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${liftStatusColor(lift.status)}`} />
                  <span className="text-sm text-neutral-300 flex-1 truncate">{lift.name}</span>
                  <span className="text-xs text-neutral-500">{liftStatusLabel(lift.status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
