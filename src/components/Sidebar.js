'use client'

import { useState } from 'react'
import Link from 'next/link'
import { conditionColor, conditionsScore } from '../lib/conditions.js'
import ScoreBadge from './ScoreBadge.js'
import BookmarkButton from './BookmarkButton.js'

export default function Sidebar({ resorts, activeId, distances = {}, savedIds = [], isLoggedIn = false }) {
  const [filter, setFilter] = useState('all')
  const [savedSet, setSavedSet] = useState(() => new Set(savedIds))

  function handleToggle(resortId, newSaved) {
    setSavedSet(prev => {
      const next = new Set(prev)
      if (newSaved) next.add(resortId); else next.delete(resortId)
      return next
    })
  }

  const visible = filter === 'saved'
    ? resorts.filter(r => savedSet.has(r.id))
    : resorts

  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-line overflow-y-auto">
      <div className="pt-5 pb-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-1 px-5 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'saved', label: savedSet.size > 0 ? `Saved (${savedSet.size})` : 'Saved' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  filter === key
                    ? 'bg-ice/20 text-ice'
                    : 'text-ink-faint hover:text-ink-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <p className="font-display text-[11px] font-bold tracking-widest text-ink-faint uppercase px-5 mb-4">
            Resorts
          </p>
        )}

        {visible.length === 0 && filter === 'saved' && (
          <p className="text-xs text-ink-faint px-5 py-2 leading-relaxed">
            No saved resorts yet — bookmark your favorites.
          </p>
        )}

        {visible.map((resort) => {
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
              {isLoggedIn && (
                <BookmarkButton
                  resortId={resort.id}
                  isSaved={savedSet.has(resort.id)}
                  onToggle={handleToggle}
                />
              )}
              <ScoreBadge score={conditionsScore(resort.weather)} />
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
