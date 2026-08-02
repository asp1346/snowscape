const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function forecastDayLabel(dateStr, index) {
  if (index === 0) return 'Today'
  const [y, m, d] = dateStr.split('-').map(Number)
  return DAY_ABBR[new Date(y, m - 1, d).getDay()]
}

function wmoToIcon(code) {
  if (code === 0) return 'sun'
  if (code <= 2) return 'partly-cloudy'
  if (code <= 48) return 'cloudy'
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rain'
  if (code <= 77 || code === 85 || code === 86) return 'snow'
  return 'storm'
}

export default function WeatherIcon({ code, className = 'w-6 h-6' }) {
  const type = wmoToIcon(code ?? 0)

  if (type === 'sun') return (
    <svg className={`${className} text-amber-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
    </svg>
  )

  if (type === 'partly-cloudy') return (
    <svg className={`${className} text-ink-muted`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 9a3 3 0 1 0-4 2.83V17a2 2 0 0 0 4 0v-5.17A3 3 0 0 0 10 9z" className="text-amber-400" stroke="currentColor" />
      <path d="M14 14.5A4.5 4.5 0 1 0 9.5 19H14a3 3 0 0 0 0-6h-.5" />
    </svg>
  )

  if (type === 'cloudy') return (
    <svg className={`${className} text-ink-muted`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )

  if (type === 'rain') return (
    <svg className={`${className} text-blue-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M8 19v2" /><path d="M12 19v2" /><path d="M16 19v2" />
    </svg>
  )

  if (type === 'snow') return (
    <svg className={`${className} text-sky-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M8 21l4-4 4 4" /><path d="M12 17v-4" />
    </svg>
  )

  return (
    <svg className={`${className} text-amber-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M13 12l-3 5h4l-3 5" />
    </svg>
  )
}
