'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { conditionsScore } from '../lib/conditions.js'

const SCORE_COLOR = {
  high: 'var(--color-good-dot)',
  mid: 'var(--color-mid-dot)',
  low: 'var(--color-low-dot)',
}

function markerColor(score) {
  if (score === null) return SCORE_COLOR.low
  if (score >= 70) return SCORE_COLOR.high
  if (score >= 50) return SCORE_COLOR.mid
  return SCORE_COLOR.low
}

function makeMarkerEl(color) {
  const outer = document.createElement('div')
  outer.style.cssText = `
    width: 20px; height: 20px;
    border-radius: 50%;
    background: color-mix(in oklab, ${color} 20%, transparent);
    border: 1.5px solid ${color};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  `
  const inner = document.createElement('div')
  inner.style.cssText = `
    width: 10px; height: 10px;
    border-radius: 50%;
    background: ${color};
  `
  outer.appendChild(inner)
  return outer
}

function popupHTML(resort, score) {
  const color = markerColor(score)
  const scoreLabel = score === null ? '—' : score
  return `
    <div style="min-width:200px;">
      <div style="font-weight:700;font-size:14px;color:var(--color-ink);margin-bottom:2px;">${resort.name}</div>
      <div style="font-size:11px;color:var(--color-ink-faint);margin-bottom:10px;">${resort.state} · ${resort.summit_elevation?.toLocaleString()}ft</div>
      <div style="display:flex;gap:14px;margin-bottom:12px;">
        <div>
          <div style="font-size:20px;font-weight:700;color:${color};line-height:1;">${scoreLabel}</div>
          <div style="font-size:10px;color:var(--color-ink-faint);margin-top:2px;">score</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:600;color:var(--color-ink);line-height:1;">${resort.weather.snowDepth}"</div>
          <div style="font-size:10px;color:var(--color-ink-faint);margin-top:2px;">base depth</div>
        </div>
        <div>
          <div style="font-size:20px;font-weight:600;color:var(--color-ink);line-height:1;">${resort.weather.temp}°</div>
          <div style="font-size:10px;color:var(--color-ink-faint);margin-top:2px;">temp</div>
        </div>
      </div>
      <a href="/resort/${resort.id}"
         style="display:block;text-align:center;background:var(--color-ice);color:var(--color-navy);padding:7px 12px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;">
        View conditions →
      </a>
    </div>
  `
}

export default function MapView({ resorts }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    if (!token || !containerRef.current) return

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-121.7, 47.2],
      zoom: 6,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('load', () => {
      resorts.forEach(resort => {
        const score = conditionsScore(resort.weather)
        const color = markerColor(score)

        const popup = new mapboxgl.Popup({
          offset: 14,
          closeButton: true,
          maxWidth: '260px',
        }).setHTML(popupHTML(resort, score))

        new mapboxgl.Marker({ element: makeMarkerEl(color) })
          .setLngLat([resort.longitude, resort.latitude])
          .setPopup(popup)
          .addTo(map)
      })
    })

    return () => map.remove()
  }, [resorts, token])

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-muted text-sm">
        <div className="text-center">
          <div className="text-2xl mb-3">🗺️</div>
          <div className="font-medium text-ink mb-1">Mapbox token not configured</div>
          <div>Add <code className="text-ice bg-surface-2 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your environment variables</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative" style={{ minHeight: 0 }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-10 bg-surface/90 border border-line rounded-xl px-4 py-3 text-xs text-ink-muted backdrop-blur-sm">
        <div className="font-display font-bold text-ink-faint uppercase tracking-wider mb-2 text-[10px]">Conditions score</div>
        {[
          { color: SCORE_COLOR.high, label: '70+', desc: 'Excellent' },
          { color: SCORE_COLOR.mid, label: '50–69', desc: 'Good' },
          { color: SCORE_COLOR.low, label: '<50', desc: 'Fair / Poor' },
        ].map(({ color, label, desc }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <div style={{ background: color }} className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
            <span className="font-medium text-ink">{label}</span>
            <span className="text-ink-faint">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
