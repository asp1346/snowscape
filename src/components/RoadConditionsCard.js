import { roadStatusColorClasses, roadStatusLabel } from '../lib/roads.js'

function formatUpdatedAt(date) {
  if (!date) return '—'
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function RoadConditionsCard({ accessRoad, roadApiId, roadConditions }) {
  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <span className="font-display text-sm font-bold text-ink">Road conditions</span>
        {roadConditions && (
          <span className="text-xs text-ink-faint">via {roadConditions.source}</span>
        )}
      </div>

      {!roadApiId && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Road conditions aren&apos;t tracked for this resort yet.
        </div>
      )}

      {roadApiId && !roadConditions && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          Unable to load road conditions right now.
        </div>
      )}

      {roadConditions?.empty && (
        <div className="px-6 py-8 text-sm text-ink-muted">
          No current road report for this route. ODOT crews typically file reports during active winter conditions.
        </div>
      )}

      {roadConditions && !roadConditions.empty && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-sm text-ink-muted mb-1">{accessRoad}</div>
              <div className="font-display text-lg font-bold text-ink">{roadConditions.statusText}</div>
            </div>
            {(() => {
              const { text, bg, border } = roadStatusColorClasses(roadConditions.status)
              return (
                <span className={`font-display text-xs font-bold rounded-full border px-3 py-1 flex-shrink-0 ${text} ${bg} ${border}`}>
                  {roadStatusLabel(roadConditions.status)}
                </span>
              )
            })()}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-2 border border-line rounded-xl p-3">
              <div className="text-xs text-ink-muted">Chains required</div>
              <div className="font-display text-lg font-bold text-ink mt-1">
                {roadConditions.chainsRequired ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="bg-surface-2 border border-line rounded-xl p-3">
              <div className="text-xs text-ink-muted">Last updated</div>
              <div className="font-display text-lg font-bold text-ink mt-1">
                {formatUpdatedAt(roadConditions.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
