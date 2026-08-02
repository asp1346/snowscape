'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import BestForMe from './BestForMe.js'
import Logo from './Logo.js'
import ThemeToggle from './ThemeToggle.js'
import AuthModal from './AuthModal.js'
import { createClient } from '../lib/supabase-browser.js'

const NAV_LINKS = [
  { label: 'Conditions', href: '/' },
  { label: 'Map', href: '/map' },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authModal, setAuthModal] = useState(null) // null | 'signin' | 'signup'
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [resortList, setResortList] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setAuthModal(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load resort list once on first focus, cache in state
  async function loadResorts() {
    if (resortList.length > 0) return
    const supabase = createClient()
    const { data } = await supabase.from('resorts').select('id, name, state').order('name')
    setResortList(data || [])
  }

  const results = query.trim()
    ? resortList.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : resortList

  function handleFocus() {
    loadResorts()
    setSearchOpen(true)
    setHighlighted(0)
  }

  function handleSearch(value) {
    setQuery(value)
    setHighlighted(0)
    setSearchOpen(true)
  }

  function selectResort(resort) {
    setQuery('')
    setSearchOpen(false)
    router.push(`/resort/${resort.id}`)
  }

  function handleKeyDown(e) {
    if (!searchOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[highlighted]) {
      selectResort(results[highlighted])
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
      inputRef.current?.blur()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.refresh()
  }

  function isActive(href) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/resort')
    return pathname === href
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <nav className="flex items-center gap-6 px-6 h-14 bg-navy flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Logo variant="onDark" size={24} />
          <span className="font-display font-bold text-white tracking-tight text-base">Snowscape</span>
        </div>
        <div className="w-px h-5 bg-white/15" />
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 bg-navy-soft rounded-lg px-3 py-2 w-72">
            <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search any resort..."
              className="bg-transparent text-white/90 placeholder:text-white/40 text-sm outline-none w-full"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSearchOpen(false); inputRef.current?.focus() }}
                className="text-white/40 hover:text-white/70 leading-none"
              >
                ×
              </button>
            )}
          </div>

          {searchOpen && results.length > 0 && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-surface border border-line rounded-xl shadow-xl overflow-hidden z-50">
              {results.map((resort, i) => (
                <button
                  key={resort.id}
                  onMouseDown={() => selectResort(resort)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === highlighted ? 'bg-surface-2' : ''
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{resort.name}</div>
                    <div className="text-xs text-ink-faint">{resort.state}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-sm px-3.5 py-2 rounded-lg transition-colors ${
                isActive(href)
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-white/55 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
          {['Forecast', 'Alerts'].map(label => (
            <button
              key={label}
              disabled
              className="text-sm px-3.5 py-2 rounded-lg text-white/25 cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <BestForMe />
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="w-8 h-8 rounded-full bg-ice text-navy font-display font-bold text-sm flex items-center justify-center hover:brightness-95 transition-[filter]"
                aria-label="Account menu"
              >
                {initials}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-10 z-50 w-56 bg-surface border border-line rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-line">
                      <div className="text-xs text-ink-faint truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-3 text-sm text-ink hover:bg-surface-2 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModal('signin')}
                className="text-sm text-white/70 hover:text-white px-3 py-2 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => setAuthModal('signup')}
                className="font-display font-bold text-sm text-navy bg-ice hover:brightness-95 px-5 py-2 rounded-lg transition-[filter] whitespace-nowrap"
              >
                Sign up free
              </button>
            </div>
          )}
        </div>
      </nav>

      {authModal && (
        <AuthModal
          initialTab={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  )
}
