import Link from 'next/link'
import { getResortsWithWeather } from '../../lib/resorts.js'
import { conditionColor, snowColor } from '../../lib/conditions.js'
import Nav from '../../components/Nav.js'
import WeatherIcon, { forecastDayLabel } from '../../components/WeatherIcon.js'

export const dynamic = 'force-dynamic'

export default async function ForecastPage() {
  const resorts = await getResortsWithWeather()

  // Sort by total 7-day expected snowfall descending
  const sorted = [...resorts].sort((a, b) => {
    const totalA = a.weather.dailySnow.reduce((s, v) => s + v, 0)
    const totalB = b.weather.dailySnow.reduce((s, v) => s + v, 0)
    return totalB - totalA
  })

  const dates = sorted[0]?.weather.dailyDates ?? []

  return (
    <div className="flex flex-col h-screen bg-page overflow-hidden">
      <Nav />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">

          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-ink tracking-tight">7-Day Forecast</h1>
            <p className="text-sm text-ink-faint mt-1">All resorts · sorted by expected snowfall</p>
          </div>

          <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">

                {/* Header row */}
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left px-6 py-3 w-56 sticky left-0 bg-surface z-10">
                      <span className="font-display text-xs font-bold text-ink-faint uppercase tracking-widest">Resort</span>
                    </th>
                    <th className="px-3 py-3 text-center w-20">
                      <span className="font-display text-xs font-bold text-ink-faint uppercase tracking-widest">Depth</span>
                    </th>
                    {dates.map((dateStr, i) => (
                      <th key={dateStr} className="px-2 py-3 text-center w-24">
                        <span className="font-display text-xs font-bold text-ink-faint uppercase tracking-widest">
                          {forecastDayLabel(dateStr, i)}
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center w-20">
                      <span className="font-display text-xs font-bold text-ink-faint uppercase tracking-widest">7-Day</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line-2">
                  {sorted.map((resort) => {
                    const total = resort.weather.dailySnow.reduce((s, v) => s + v, 0)
                    return (
                      <tr key={resort.id} className="hover:bg-surface-2 transition-colors group">

                        {/* Resort name — sticky */}
                        <td className="px-6 py-4 sticky left-0 bg-surface group-hover:bg-surface-2 transition-colors z-10">
                          <Link href={`/resort/${resort.id}`} className="flex items-center gap-2.5">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conditionColor(resort.weather.snowDepth)}`} />
                            <div>
                              <div className="text-sm font-semibold text-ink hover:text-ice transition-colors">{resort.name}</div>
                              <div className="text-xs text-ink-faint">{resort.state}</div>
                            </div>
                          </Link>
                        </td>

                        {/* Current snow depth */}
                        <td className="px-3 py-4 text-center">
                          <span className="font-display text-sm font-bold text-ink">{resort.weather.snowDepth}&quot;</span>
                        </td>

                        {/* 7 daily cells */}
                        {resort.weather.dailyDates.map((dateStr, i) => (
                          <td key={dateStr} className="px-2 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <WeatherIcon code={resort.weather.dailyCodes[i]} className="w-4 h-4" />
                              <span className={`font-display text-xs font-semibold ${snowColor(resort.weather.dailySnow[i])}`}>
                                {resort.weather.dailySnow[i] > 0 ? `${resort.weather.dailySnow[i]}"` : '—'}
                              </span>
                              <span className="text-xs text-ink-faint">{resort.weather.dailyHigh[i]}°</span>
                            </div>
                          </td>
                        ))}

                        {/* 7-day total */}
                        <td className="px-4 py-4 text-center">
                          <span className={`font-display text-sm font-bold ${total > 0 ? 'text-sky-300' : 'text-ink-faint'}`}>
                            {total > 0 ? `${Math.round(total * 10) / 10}"` : '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-ink-faint mt-4">
            Forecast data from Open-Meteo · Updated hourly · Snow totals in inches
          </p>
        </div>
      </main>
    </div>
  )
}
