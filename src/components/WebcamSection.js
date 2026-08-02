'use client'

import { useEffect, useState } from 'react'

function CameraIcon() {
  return (
    <svg className="w-8 h-8 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  )
}

function SkeletonFrame() {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video w-full rounded-xl bg-surface-2 animate-pulse" />
      <div className="h-3 w-32 rounded bg-surface-2 animate-pulse" />
    </div>
  )
}

function EmbedFrame({ cam }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-950">
        <iframe
          src={cam.playerUrl}
          title={cam.title}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
      {cam.title && (
        <span className="text-xs font-semibold text-ink truncate">{cam.title}</span>
      )}
    </div>
  )
}

export default function WebcamSection({ webcamIds }) {
  const ids = webcamIds ?? []
  const [cams, setCams] = useState([])
  const [loading, setLoading] = useState(ids.length > 0)

  useEffect(() => {
    if (!ids.length) return

    Promise.all(
      ids.map(id =>
        fetch(`/api/webcams/${id}`)
          .then(r => r.json())
          .catch(() => null)
      )
    ).then(results => {
      setCams(results.filter(r => r?.playerUrl))
      setLoading(false)
    })
  }, [])

  const showPlaceholder = !loading && (ids.length === 0 || cams.length === 0)

  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-line">
        <span className="font-display text-sm font-bold text-ink">Webcams</span>
      </div>

      {showPlaceholder ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <CameraIcon />
          <div className="text-center">
            <p className="text-sm font-semibold text-ink">Webcam coming soon</p>
            <p className="text-xs text-ink-faint mt-1">Live camera feed will appear here</p>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className={`grid gap-4 ${cams.length > 1 || loading ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {loading
              ? ids.map(id => <SkeletonFrame key={id} />)
              : cams.map(cam => <EmbedFrame key={cam.webcamId} cam={cam} />)
            }
          </div>
          {!loading && (
            <div className="mt-4 flex justify-end">
              <a
                href="https://webcams.windy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ink-faint hover:text-ink transition-colors"
              >
                Powered by Windy
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
