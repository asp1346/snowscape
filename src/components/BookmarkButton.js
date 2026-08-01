'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase-browser.js'

export default function BookmarkButton({ resortId, initialSaved, isSaved: isSavedProp, onToggle, className = '' }) {
  const controlled = onToggle !== undefined
  const [internalSaved, setInternalSaved] = useState(initialSaved ?? false)
  const saved = controlled ? isSavedProp : internalSaved
  const [pending, setPending] = useState(false)

  async function toggle(e) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    setPending(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setPending(false); return }

    if (saved) {
      await supabase.from('saved_resorts').delete().match({ user_id: user.id, resort_id: resortId })
    } else {
      await supabase.from('saved_resorts').insert({ user_id: user.id, resort_id: resortId })
    }

    if (controlled) {
      onToggle(resortId, !saved)
    } else {
      setInternalSaved(s => !s)
    }
    setPending(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`flex-shrink-0 transition-opacity ${pending ? 'opacity-40' : 'opacity-100'} ${className}`}
      title={saved ? 'Remove from saved' : 'Save resort'}
    >
      {saved ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-ice">
          <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-ink-faint hover:text-ink-muted">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      )}
    </button>
  )
}
