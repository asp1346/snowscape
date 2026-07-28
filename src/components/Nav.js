'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BestForMe from './BestForMe.js'

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
    <nav className="flex items-center gap-4 px-6 h-14 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs">❄</div>
        <span className="font-semibold text-white tracking-tight text-base">Snowscape</span>
      </div>
      <div className="w-px h-5 bg-neutral-800 mx-1" />
      <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 w-72">
        <svg className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="text-neutral-500 text-sm">Search any resort...</span>
      </div>
      <div className="flex items-center gap-0.5 ml-2">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isActive(href)
                ? 'text-white bg-neutral-800 font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {label}
          </Link>
        ))}
        {['Forecast', 'Alerts'].map(label => (
          <button
            key={label}
            disabled
            className="text-sm px-3 py-1.5 rounded-lg text-neutral-600 cursor-not-allowed"
          >
            {label}
          </button>
        ))}
      </div>
      <BestForMe />
    </nav>
  )
}
