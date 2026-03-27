import { supabase } from '../lib/supabase.js'
import { getWeatherForResort } from '../lib/weather.js'

export default async function Home() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('*')
    .order('name')

  if (error) {
    console.error(error)
    return <div>Error loading resorts</div>
  }

  const resortsWithWeather = await Promise.all(
    resorts.map(async (resort) => {
      const weather = await getWeatherForResort(resort.latitude, resort.longitude)
      return { ...resort, weather }
    })
  )

  const featured = resortsWithWeather[0]
  const days = ['Today', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

  function conditionColor(depth) {
    if (depth > 60) return 'bg-emerald-500'
    if (depth > 30) return 'bg-blue-500'
    return 'bg-amber-500'
  }

  function snowColor(inches) {
    if (inches > 2) return 'text-blue-400'
    if (inches > 0) return 'text-blue-300'
    return 'text-neutral-600'
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">

      {/* Nav */}
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

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 overflow-y-auto">
          <div className="pt-5 pb-4">
            <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase px-5 mb-3">
              Resorts
            </p>
            {resortsWithWeather.map((resort, i) => (
              <div
                key={resort.id}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors ${
                  i === 0
                    ? 'bg-neutral-800 border-r-2 border-emerald-500'
                    : 'hover:bg-neutral-800/50'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${conditionColor(resort.weather.snowDepth)}`} />
                <span className={`text-sm flex-1 truncate ${i === 0 ? 'text-white font-medium' : 'text-neutral-400'}`}>
                  {resort.name}
                </span>
                <span className="text-xs text-neutral-500 flex-shrink-0">
                  {resort.weather.snowDepth}"
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-neutral-950">
          <div className="p-8 max-w-6xl">

            {/* Resort header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-white tracking-tight">
                  {featured.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-neutral-400">
                    {featured.state} · {featured.summit_elevation.toLocaleString()}ft summit
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                    ● Live
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-light text-white">
                  {featured.weather.temp}°<span className="text-3xl text-neutral-500">F</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1.5">current temperature</div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Snow depth', value: featured.weather.snowDepth, unit: '"', sub: 'at summit' },
                { label: 'New snowfall', value: featured.weather.snowfall, unit: '"', sub: 'last reading' },
                { label: 'Wind speed', value: featured.weather.windSpeed, unit: ' mph', sub: 'at summit' },
                { label: 'Temperature', value: featured.weather.temp, unit: '°F', sub: 'current' },
              ].map(stat => (
                <div key={stat.label} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <div className="text-3xl font-semibold text-white leading-none">
                    {stat.value}
                    <span className="text-base font-normal text-neutral-500 ml-1">{stat.unit}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-2.5">{stat.label}</div>
                  <div className="text-xs text-neutral-700 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

              {/* Forecast */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                  <span className="text-sm font-medium text-white">7-day forecast</span>
                  <span className="text-xs text-neutral-500">Snowfall inches</span>
                </div>
                <div className="grid grid-cols-7 divide-x divide-neutral-800">
                  {days.map((day, i) => (
                    <div key={day} className="text-center py-5 px-2">
                      <div className="text-xs text-neutral-500 mb-3">{day}</div>
                      <div className={`text-sm font-semibold ${snowColor(featured.weather.dailySnow[i])}`}>
                        {featured.weather.dailySnow[i] > 0
                          ? `${featured.weather.dailySnow[i]}"`
                          : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions bars */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-800">
                  <span className="text-sm font-medium text-white">Overview</span>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  {[
                    { label: 'Snow depth', value: featured.weather.snowDepth, max: 200, unit: '"', color: 'bg-blue-500' },
                    { label: 'Wind speed', value: featured.weather.windSpeed, max: 80, unit: ' mph', color: 'bg-amber-500' },
                    { label: 'New snow', value: featured.weather.snowfall, max: 20, unit: '"', color: 'bg-emerald-500' },
                  ].map(bar => (
                    <div key={bar.label}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-xs text-neutral-400">{bar.label}</span>
                        <span className="text-sm font-semibold text-white">{bar.value}{bar.unit}</span>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bar.color} transition-all`}
                          style={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* All resorts table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800">
                <span className="text-sm font-medium text-white">All resorts</span>
              </div>
              <div className="divide-y divide-neutral-800/60">
                {resortsWithWeather.map(resort => (
                  <div key={resort.id} className="flex items-center gap-6 px-6 py-4 hover:bg-neutral-800/40 cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conditionColor(resort.weather.snowDepth)}`} />
                    <div className="w-44 flex-shrink-0">
                      <div className="text-sm font-medium text-white">{resort.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{resort.state} · {resort.summit_elevation.toLocaleString()}ft</div>
                    </div>
                    <div className="flex items-baseline gap-1 w-24 flex-shrink-0">
                      <span className="text-lg font-semibold text-white">{resort.weather.snowDepth}</span>
                      <span className="text-xs text-neutral-500">" base</span>
                    </div>
                    <div className="flex items-baseline gap-1 w-20 flex-shrink-0">
                      <span className="text-sm text-neutral-300">{resort.weather.temp}°</span>
                      <span className="text-xs text-neutral-500">F</span>
                    </div>
                    <div className="flex items-baseline gap-1 w-24 flex-shrink-0">
                      <span className="text-sm text-neutral-300">{resort.weather.windSpeed}</span>
                      <span className="text-xs text-neutral-500">mph wind</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {resort.weather.dailySnow.slice(0, 4).map((snow, i) => (
                        <div key={i} className="text-center w-8">
                          <div className={`text-xs font-medium ${
                            snow > 2 ? 'text-blue-400' :
                            snow > 0 ? 'text-blue-300/70' :
                            'text-neutral-700'
                          }`}>
                            {snow > 0 ? `${snow}"` : '—'}
                          </div>
                          <div className="text-xs text-neutral-700 mt-0.5">{days[i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}