export function conditionColor(depth) {
  if (depth > 60) return 'bg-good-dot'
  if (depth > 30) return 'bg-mid-dot'
  return 'bg-low-dot'
}

export function snowColor(inches) {
  if (inches > 2) return 'text-mid'
  if (inches > 0) return 'text-mid/70'
  return 'text-ink-faint'
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max)
}

export function scoreFromValue(value, max) {
  return clamp((value / max) * 100)
}

export function scoreFromValueInverse(value, max) {
  return clamp(100 - (value / max) * 100)
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

  const depthScore = scoreFromValue(weather.snowDepth, 200)
  const snowfallScore = scoreFromValue(weather.snowfall, 20)
  const windScore = scoreFromValueInverse(weather.windSpeed, 80)
  const tempScore = scoreFromValueInverse(weather.temp, 50)

  const score =
    depthScore * 0.4 +
    snowfallScore * 0.3 +
    windScore * 0.2 +
    tempScore * 0.1

  return Math.round(score)
}

export function scoreColorClasses(score) {
  if (score >= 70) {
    return { text: 'text-good', bg: 'bg-good-bg', border: 'border-good-border' }
  }
  if (score >= 50) {
    return { text: 'text-mid', bg: 'bg-mid-bg', border: 'border-mid-border' }
  }
  return { text: 'text-low', bg: 'bg-low-bg', border: 'border-low-border' }
}
