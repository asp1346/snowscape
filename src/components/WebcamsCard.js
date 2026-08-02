'use client'

import { useEffect, useState } from 'react'

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 90) return 'just now'
  const mins = Math.floor(secs / 60)
  return `${mins} min ago`
}

function CameraIcon() {
  return (
    <svg className="w-7 h-7 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  )
}

function CameraFrame({ cam, ts }) {
  const [error, setError] = useState(false)

  useEffect(() => { setError(false) }, [cam.url, ts])

  const active = cam.url && !error

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[4/3] bg-surface-2 border border-line rounded-xl overflow-hidden flex items-center justify-center">
        {active ? (
          <img
            src={`${cam.url}?t=${ts}`}
            alt={`${cam.label} webcam`}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <CameraIcon />
            <span className="text-[11px] text-ink-faint">
              {cam.url ? 'Unable to load' : 'Feed not available'}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-ink">{cam.label}</span>
        <span className="text-xs text-ink-faint">
          {active ? `Updated ${timeAgo(ts)}` : '—'}
        </span>
      </div>
    </div>
  )
}

export default function WebcamsCard({ resortName, webcams }) {
  const [ts, setTs] = useState(() => Date.now())
  // tick forces child re-renders so timeAgo() stays current between image refreshes
  const [, setTick] = useState(0)

  useEffect(() => {
    const tickTimer = setInterval(() => setTick(t => t + 1), 30000)
    const refreshTimer = setInterval(() => setTs(Date.now()), 60000)
    return () => {
      clearInterval(tickTimer)
      clearInterval(refreshTimer)
    }
  }, [])

  if (!webcams?.length) return null

  const hasLiveFeed = webcams.some(c => c.url)

  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <span className="font-display text-sm font-bold text-ink">
          Webcams · {resortName}
        </span>
        {hasLiveFeed && (
          <span className="text-xs font-bold text-good bg-good-bg border border-good-border px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-good-dot inline-block" />
            Live
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {webcams.map(cam => (
            <CameraFrame key={cam.label} cam={cam} ts={ts} />
          ))}
        </div>
      </div>
    </div>
  )
}
