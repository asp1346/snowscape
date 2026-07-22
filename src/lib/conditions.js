export function conditionColor(depth) {
  if (depth > 60) return 'bg-emerald-500'
  if (depth > 30) return 'bg-blue-500'
  return 'bg-amber-500'
}

export function snowColor(inches) {
  if (inches > 2) return 'text-blue-400'
  if (inches > 0) return 'text-blue-300'
  return 'text-neutral-600'
}

function clamp(value) {
  return Math.min(Math.max(value, 0), 100)
}

export function conditionsScore(weather) {
  if (
    weather.snowDepth == null ||
    weather.snowfall == null ||
    weather.windSpeed == null ||
    weather.temp == null
  ) {
    return null
  }

  const depthScore = clamp((weather.snowDepth / 200) * 100)
  const snowfallScore = clamp((weather.snowfall / 20) * 100)
  const windScore = clamp(100 - (weather.windSpeed / 80) * 100)
  const tempScore = clamp(((50 - weather.temp) / 50) * 100)

  const score =
    depthScore * 0.4 +
    snowfallScore * 0.3 +
    windScore * 0.2 +
    tempScore * 0.1

  return Math.round(score)
}

export function scoreColorClasses(score) {
  if (score >= 70) {
    return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' }
  }
  if (score >= 50) {
    return { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' }
  }
  return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
}
