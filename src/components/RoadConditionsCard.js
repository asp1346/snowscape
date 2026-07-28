import { roadStatusColorClasses, roadStatusLabel } from '../lib/roads.js'

function formatUpdatedAt(date) {
  if (!date) return '—'
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function RoadConditionsCard({ accessRoad, roadApiId, roadConditions }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <span className="text-sm font-medium text-white">Road conditions</span>
        {roadConditions && (
          <span className="text-xs text-neutral-500">via {roadConditions.source}</span>
        )}
      </div>

      {!roadApiId && (
        <div className="px-6 py-8 text-sm text-neutral-500">
          Road conditions aren&apos;t tracked for this resort yet.
        </div>
      )}

      {roadApiId && !roadConditions && (
        <div className="px-6 py-8 text-sm text-neutral-500">
          Unable to load road conditions right now.
        </div>
      )}

      {roadConditions?.empty && (
        <div className="px-6 py-8 text-sm text-neutral-500">
          No current road report for this route. ODOT crews typically file reports during active winter conditions.
        </div>
      )}

      {roadConditions && !roadConditions.empty && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-sm text-neutral-400 mb-1">{accessRoad}</div>
              <div className="text-lg font-semibold text-white">{roadConditions.statusText}</div>
            </div>
            {(() => {
              const { text, bg, border } = roadStatusColorClasses(roadConditions.status)
              return (
                <span className={`text-xs font-semibold rounded-full border px-3 py-1 flex-shrink-0 ${text} ${bg} ${border}`}>
                  {roadStatusLabel(roadConditions.status)}
                </span>
              )
            })()}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-800/50 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400">Chains required</div>
              <div className="text-lg font-semibold text-white mt-1">
                {roadConditions.chainsRequired ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-800 rounded-xl p-3">
              <div className="text-xs text-neutral-400">Last updated</div>
              <div className="text-lg font-semibold text-white mt-1">
                {formatUpdatedAt(roadConditions.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
