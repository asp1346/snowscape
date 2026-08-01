import Link from 'next/link'
import { conditionColor, conditionsScore } from '../lib/conditions.js'
import ScoreBadge from './ScoreBadge.js'

export default function Sidebar({ resorts, activeId, distances = {} }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-line overflow-y-auto">
      <div className="pt-5 pb-4">
        <p className="font-display text-[11px] font-bold tracking-widest text-ink-faint uppercase px-5 mb-4">
          Resorts
        </p>
        {resorts.map((resort) => {
          const isActive = resort.id === activeId
          return (
            <Link
              key={resort.id}
              href={`/resort/${resort.id}`}
              className={`flex items-center gap-3 px-5 py-3 border-l-[3px] transition-colors ${
                isActive
                  ? 'border-ice bg-ice/10'
                  : 'border-transparent hover:bg-surface-2'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${conditionColor(resort.weather.snowDepth)}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate ${isActive ? 'text-ink font-bold' : 'text-ink-muted font-medium'}`}>
                  {resort.name}
                </div>
                {distances[resort.id] !== undefined && (
                  <div className="text-xs text-ink-faint">{distances[resort.id]} mi</div>
                )}
              </div>
              <ScoreBadge score={conditionsScore(resort.weather)} />
              <span className="font-display text-xs text-ink-faint flex-shrink-0">
                {resort.weather.snowDepth}&quot;
              </span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
