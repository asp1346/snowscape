'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setAuthModal(null)
    })
    return () => subscription.unsubscribe()
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
        <div className="flex items-center gap-2 bg-navy-soft rounded-lg px-3 py-2 w-72">
          <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-white/50 text-sm">Search any resort...</span>
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
