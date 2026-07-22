import { conditionColor, snowColor } from '../lib/conditions.js'

const days = ['Today', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

export default function ResortDetail({ featured, resorts }) {
  return (
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
            {resorts.map(resort => (
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
  )
}
