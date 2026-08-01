'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BestForMe from './BestForMe.js'
import Logo from './Logo.js'
import ThemeToggle from './ThemeToggle.js'

const NAV_LINKS = [
  { label: 'Conditions', href: '/' },
  { label: 'Map', href: '/map' },
]

export default function Nav() {
  const pathname = usePathname()

  function isActive(href) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/resort')
    return pathname === href
  }

  return (
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
      <div className="ml-auto flex items-center gap-4">
        <BestForMe />
        <ThemeToggle />
        <button
          type="button"
          className="font-display font-bold text-sm text-navy bg-ice hover:brightness-95 px-5 py-2 rounded-lg transition-[filter] whitespace-nowrap"
        >
          Sign up free
        </button>
      </div>
    </nav>
  )
}
