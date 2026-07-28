'use client'

import { useEffect, useState } from 'react'
import { findBestResorts } from '../app/actions.js'
import { CRITERIA, DEFAULT_WEIGHTS, PRESETS } from '../lib/riderPresets.js'
import ScoreBadge from './ScoreBadge.js'

export default function BestForMe() {
  const [open, setOpen] = useState(false)
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)
  const [activePreset, setActivePreset] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  function applyPreset(preset) {
    setActivePreset(preset.name)
    setWeights(preset.weights)
    setResults(null)
    setError(null)
  }

  function updateWeight(key, value) {
    setActivePreset(null)
    setResults(null)
    setError(null)
    setWeights(w => ({ ...w, [key]: value }))
  }

  async function handleFindBest() {
    setLoading(true)
    setError(null)
    try {
      const data = await findBestResorts(weights)
      setResults(data)
      if (data.length === 0) {
        setError(
          'Raise at least one of Fresh snow, Snow quality, Drive time, or Road conditions — those are the only criteria we have live data for right now.'
        )
      }
    } catch {
      setError('Something went wrong finding your best resort. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-auto text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full transition-colors whitespace-nowrap"
      >
        Best for me ↗
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Best for me resort scorer"
            className="relative bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 sticky top-0 bg-neutral-950">
              <h2 className="text-lg font-semibold text-white">Best for me</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-neutral-500 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Riding style presets */}
              <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase mb-3">
                Riding style
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`text-sm px-3 py-2.5 rounded-xl border transition-colors ${
                      activePreset === preset.name
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-medium'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Weighted sliders */}
              <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase mb-3">
                What matters to you
              </p>
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-5 mb-6">
                {CRITERIA.map(criterion => (
                  <div key={criterion.key}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-neutral-300">
                        {criterion.label}
                        {!criterion.hasData && (
                          <span className="text-xs text-neutral-600 ml-2">(no live data yet)</span>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-white">{weights[criterion.key]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={weights[criterion.key]}
                      onChange={e => updateWeight(criterion.key, Number(e.target.value))}
                      className={`w-full accent-emerald-600 ${!criterion.hasData ? 'opacity-50' : ''}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleFindBest}
                disabled={loading}
                className="w-full text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white px-5 py-2.5 rounded-xl transition-colors mb-6"
              >
                {loading ? 'Scoring resorts…' : 'Find my best resort'}
              </button>

              {error && (
                <div className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              {results && results.length > 0 && (
                <div className="flex flex-col gap-2">
                  {results.map(result => (
                    <div
                      key={result.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                        {result.rank}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{result.name}</span>
                          <ScoreBadge score={result.compositeScore} />
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">{result.reason}</div>
                      </div>

                      <div className="flex gap-4 flex-shrink-0 text-right">
                        <div>
                          <div className="text-sm font-semibold text-white">{result.snowDepth}&quot;</div>
                          <div className="text-xs text-neutral-600">base</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{result.temp}°</div>
                          <div className="text-xs text-neutral-600">temp</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {result.openLifts != null ? `${result.openLifts}/${result.totalLifts}` : '—'}
                          </div>
                          <div className="text-xs text-neutral-600">lifts</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
