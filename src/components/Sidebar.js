import Link from 'next/link'
import { conditionColor } from '../lib/conditions.js'

export default function Sidebar({ resorts, activeId }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 overflow-y-auto">
      <div className="pt-5 pb-4">
        <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase px-5 mb-3">
          Resorts
        </p>
        {resorts.map((resort) => {
          const isActive = resort.id === activeId
          return (
            <Link
              key={resort.id}
              href={`/resort/${resort.id}`}
              className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                isActive
                  ? 'bg-neutral-800 border-r-2 border-emerald-500'
                  : 'hover:bg-neutral-800/50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${conditionColor(resort.weather.snowDepth)}`} />
              <span className={`text-sm flex-1 truncate ${isActive ? 'text-white font-medium' : 'text-neutral-400'}`}>
                {resort.name}
              </span>
              <span className="text-xs text-neutral-500 flex-shrink-0">
                {resort.weather.snowDepth}"
              </span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
