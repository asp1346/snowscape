export default function Nav() {
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
        {['Conditions', 'Forecast', 'Map', 'Alerts'].map(link => (
          <button key={link} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
            link === 'Conditions'
              ? 'text-white bg-neutral-800 font-medium'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}>
            {link}
          </button>
        ))}
      </div>
      <button className="ml-auto text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full transition-colors whitespace-nowrap">
        Best for me ↗
      </button>
    </nav>
  )
}
