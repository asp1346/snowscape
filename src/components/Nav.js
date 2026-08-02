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
  { label: 'Forecast', href: '/forecast' },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authModal, setAuthModal] = useState(null) // null | 'signin' | 'signup'
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [bestForMeOpen, setBestForMeOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [resortList, setResortList] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const navRef = useRef(null)
  const desktopInputRef = useRef(null)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setAuthModal(null)
    })
    return () => subscription.unsubscribe()
  }, [])

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
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
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
      setMobileSearchOpen(false)
      desktopInputRef.current?.blur()
      mobileInputRef.current?.blur()
    }
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSearchOpen(false)
        setMobileMenuOpen(false)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function toggleMobileSearch() {
    setMobileSearchOpen(o => {
      if (!o) setMobileMenuOpen(false)
      return !o
    })
    setSearchOpen(false)
    setQuery('')
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(o => {
      if (!o) setMobileSearchOpen(false)
      return !o
    })
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    router.refresh()
  }

  function isActive(href) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/resort')
    return pathname === href
  }

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'

  const SearchResults = () => searchOpen && results.length > 0 ? (
    <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-line rounded-xl shadow-xl overflow-hidden z-50">
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
  ) : null

  const UserMenu = () => (
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
  )

  return (
    <>
      <div ref={navRef} className="bg-navy flex-shrink-0">

        <nav className="flex items-center px-4 md:px-6 h-14 gap-3">

          {/* Logo — always visible */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Logo variant="onDark" size={24} />
            <span className="font-display font-bold text-white tracking-tight text-base">Snowscape</span>
          </div>

          {/* Desktop-only: divider + search + nav links */}
          <div className="hidden md:flex items-center gap-6 flex-1 ml-2">
            <div className="w-px h-5 bg-white/15 flex-shrink-0" />

            <div className="relative w-72">
              <div className="flex items-center gap-2 bg-navy-soft rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={desktopInputRef}
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search any resort..."
                  className="bg-transparent text-white/90 placeholder:text-white/40 text-sm outline-none w-full"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setSearchOpen(false); desktopInputRef.current?.focus() }}
                    className="text-white/40 hover:text-white/70 leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
              <SearchResults />
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
              <button disabled className="text-sm px-3.5 py-2 rounded-lg text-white/25 cursor-not-allowed">
                Alerts
              </button>
            </div>
          </div>

          {/* Desktop-only: right side */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <BestForMe />
            <ThemeToggle />
            {user ? (
              <UserMenu />
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

          {/* Mobile-only: search icon + theme + avatar + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={toggleMobileSearch}
              className={`p-2 transition-colors ${mobileSearchOpen ? 'text-white' : 'text-white/60 hover:text-white'}`}
              aria-label={mobileSearchOpen ? 'Close search' : 'Search resorts'}
            >
              {mobileSearchOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              )}
            </button>
            <ThemeToggle />
            {user && <UserMenu />}
            <button
              onClick={toggleMobileMenu}
              className={`p-2 transition-colors ${mobileMenuOpen ? 'text-white' : 'text-white/60 hover:text-white'}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile search panel */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3">
            <div className="relative">
              <div className="flex items-center gap-2 bg-navy-soft rounded-lg px-3 py-2.5">
                <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={mobileInputRef}
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search any resort..."
                  className="bg-transparent text-white/90 placeholder:text-white/40 text-sm outline-none w-full"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setSearchOpen(false); mobileInputRef.current?.focus() }}
                    className="text-white/40 hover:text-white/70 leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
              <SearchResults />
            </div>
          </div>
        )}

        {/* Mobile menu — 2b layout */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 pb-4">

            {/* 1. Auth row */}
            <div className="px-4 pt-4 pb-3">
              {user ? (
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-sm text-white/70 truncate">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="text-sm text-white/50 hover:text-white ml-4 transition-colors flex-shrink-0"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthModal('signin') }}
                    className="flex-1 text-sm font-bold text-white border border-white/20 rounded-xl py-3 text-center transition-colors hover:bg-white/5"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthModal('signup') }}
                    className="flex-1 text-sm font-bold text-navy bg-ice rounded-xl py-3 text-center hover:brightness-95 transition-[filter]"
                  >
                    Sign up free
                  </button>
                </div>
              )}
            </div>

            {/* 2. Best for me featured card */}
            <div className="px-4 pb-3">
              <button
                onClick={() => { setMobileMenuOpen(false); setBestForMeOpen(true) }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.72 0.14 215 / 20%), oklch(0.7 0.19 35 / 10%))',
                  border: '1px solid oklch(0.72 0.14 215 / 30%)',
                }}
              >
                {/* Icon tile */}
                <div className="w-9 h-9 rounded-[9px] bg-ice flex items-center justify-center flex-shrink-0">
                  <svg className="w-4.5 h-4.5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">Best for me</div>
                  <div className="text-xs text-white/60 mt-0.5">Your personalized top picks</div>
                </div>
                <svg className="w-4 h-4 text-ice flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* 3. Divider */}
            <div className="h-px bg-white/10 mx-5 mb-2" />

            {/* 4. Nav links */}
            <div className="px-3 pt-1 flex flex-col gap-0.5">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm transition-colors ${
                      active
                        ? 'bg-navy-soft font-bold text-white'
                        : 'font-medium text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-ice' : 'opacity-0'}`} />
                    {label}
                  </Link>
                )
              })}
              <button
                disabled
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm text-white/25 text-left cursor-not-allowed"
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-0" />
                Alerts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Best for me modal — controlled from nav, shared between desktop button and mobile card */}
      <BestForMe open={bestForMeOpen} onClose={() => setBestForMeOpen(false)} />

      {authModal && (
        <AuthModal
          initialTab={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  )
}
