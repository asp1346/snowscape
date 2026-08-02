import { conditionColor, conditionsScore, snowColor } from '../lib/conditions.js'
import ScoreBadge from './ScoreBadge.js'
import LiftStatusCard from './LiftStatusCard.js'
import RoadConditionsCard from './RoadConditionsCard.js'
import WebcamSection from './WebcamSection.js'
import BookmarkButton from './BookmarkButton.js'
import WeatherIcon, { forecastDayLabel } from './WeatherIcon.js'

export default function ResortDetail({ featured, resorts, liftStatus, roadConditions, distances = {}, savedIds = [], isLoggedIn = false }) {
  const featuredScore = conditionsScore(featured.weather)

  return (
    <main className="flex-1 overflow-y-auto bg-page">
      <div className="p-4 md:p-8 max-w-6xl">

        {/* Resort header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
                {featured.name}
              </h1>
              <ScoreBadge score={featuredScore} size="lg" />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-ink-muted">
                {featured.state} · {featured.summit_elevation.toLocaleString()}ft summit
              </span>
              <span className="text-xs font-bold text-good bg-good-bg border border-good-border px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-good-dot inline-block" />
                Live
              </span>
              {distances[featured.id] !== undefined && (
                <span className="text-xs text-ink-faint">{distances[featured.id]} mi from you</span>
              )}
              {isLoggedIn && (
                <BookmarkButton
                  resortId={featured.id}
                  initialSaved={savedIds.includes(featured.id)}
                />
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-5xl font-bold text-ink">
              {featured.weather.temp}°<span className="text-3xl text-ink-faint">F</span>
            </div>
            <div className="text-xs text-ink-faint mt-1.5">current temperature</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Snow depth', value: featured.weather.snowDepth, unit: '"', sub: featured.weather.modelElevation ? `at ${featured.weather.modelElevation.toLocaleString()}ft` : 'weather model' },
            { label: 'New snowfall', value: featured.weather.snowfall, unit: '"', sub: 'last reading' },
            { label: 'Wind speed', value: featured.weather.windSpeed, unit: ' mph', sub: 'at summit' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface border border-line rounded-2xl p-5 shadow-sm">
              <div className="font-display text-3xl font-bold text-ink leading-none">
                {stat.value}
                <span className="text-base font-normal text-ink-faint ml-1">{stat.unit}</span>
              </div>
              <div className="text-xs text-ink-muted mt-2.5">{stat.label}</div>
              <div className="text-xs text-ink-faint mt-0.5">{stat.sub}</div>
            </div>
          ))}
          <div className="bg-navy rounded-2xl p-5 shadow-sm">
            <div className="font-display text-3xl font-bold text-white leading-none">
              {featured.weather.temp}<span className="text-base font-normal text-white/60 ml-1">°F</span>
            </div>
            <div className="text-xs text-white/80 mt-2.5">Temperature</div>
            <div className="text-xs text-white/50 mt-0.5">current</div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* Forecast */}
          <div className="lg:col-span-2 bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <span className="font-display text-sm font-bold text-ink">7-day forecast</span>
              <span className="text-xs text-ink-faint">High · Snow</span>
            </div>
            <div className="overflow-x-auto">
            <div className="grid grid-cols-7 divide-x divide-line-2 min-w-[400px]">
              {featured.weather.dailyDates.map((dateStr, i) => (
                <div key={dateStr} className="flex flex-col items-center py-4 px-1 gap-2">
                  <div className="text-xs text-ink-muted">
                    {forecastDayLabel(dateStr, i)}
                  </div>
                  <WeatherIcon code={featured.weather.dailyCodes[i]} className="w-5 h-5" />
                  <div className="font-display text-sm font-bold text-ink leading-none">
                    {featured.weather.dailyHigh[i] != null ? `${featured.weather.dailyHigh[i]}°` : '—'}
                  </div>
                  <div className={`text-xs font-semibold leading-none ${snowColor(featured.weather.dailySnow[i])}`}>
                    {featured.weather.dailySnow[i] > 0 ? `${featured.weather.dailySnow[i]}"` : <span className="text-ink-faint font-normal">—</span>}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-line">
              <span className="font-display text-sm font-bold text-ink">Overview</span>
            </div>
            <div className="p-5 flex flex-col gap-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-ink-muted">Snow depth</span>
                <span className="font-display text-sm font-bold text-ink">{featured.weather.snowDepth}&quot;</span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-ink-muted">Wind speed</span>
                  <span className="font-display text-sm font-bold text-ink">{featured.weather.windSpeed} mph</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-coral transition-all"
                    style={{ width: `${Math.min((featured.weather.windSpeed / 80) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-ink-muted">New snow</span>
                <span className="font-display text-sm font-bold text-ink">{featured.weather.snowfall}&quot;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lift status */}
        <LiftStatusCard slug={featured.liftie_slug} liftStatus={liftStatus} />

        {/* Road conditions */}
        <RoadConditionsCard
          accessRoad={featured.access_road}
          roadApiId={featured.road_api_id}
          roadConditions={roadConditions}
        />

        {/* Webcams */}
        <WebcamSection webcamIds={featured.webcam_ids} />

        {/* All resorts table */}
        <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-line">
            <span className="font-display text-sm font-bold text-ink">All resorts</span>
          </div>
          <div className="overflow-x-auto">
          <div className="divide-y divide-line-2 min-w-[580px]">
            {resorts.map(resort => (
              <div key={resort.id} className="flex items-center gap-6 px-6 py-4 hover:bg-surface-2 cursor-pointer transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conditionColor(resort.weather.snowDepth)}`} />
                <div className="w-44 flex-shrink-0">
                  <div className="text-sm font-bold text-ink">{resort.name}</div>
                  <div className="text-xs text-ink-faint mt-0.5">
                    {resort.state} · {resort.summit_elevation.toLocaleString()}ft
                    {distances[resort.id] !== undefined && ` · ${distances[resort.id]} mi`}
                  </div>
                </div>
                <div className="flex items-baseline gap-1 w-24 flex-shrink-0">
                  <span className="font-display text-lg font-bold text-ink">{resort.weather.snowDepth}</span>
                  <span className="text-xs text-ink-faint">&quot; base</span>
                </div>
                <div className="flex items-baseline gap-1 w-20 flex-shrink-0">
                  <span className="font-display text-sm font-bold text-ink">{resort.weather.temp}°</span>
                  <span className="text-xs text-ink-faint">F</span>
                </div>
                <div className="flex items-baseline gap-1 w-24 flex-shrink-0">
                  <span className="font-display text-sm font-bold text-ink">{resort.weather.windSpeed}</span>
                  <span className="text-xs text-ink-faint">mph wind</span>
                </div>
                <div className="flex gap-2 ml-auto">
                  {resort.weather.dailyDates.slice(0, 4).map((dateStr, i) => (
                    <div key={dateStr} className="text-center w-8">
                      <div className={`font-display text-xs font-semibold ${snowColor(resort.weather.dailySnow[i])}`}>
                        {resort.weather.dailySnow[i] > 0 ? `${resort.weather.dailySnow[i]}"` : '—'}
                      </div>
                      <div className="text-xs text-ink-faint mt-0.5">{forecastDayLabel(dateStr, i)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

      </div>
    </main>
  )
}
