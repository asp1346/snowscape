const STATUSES = ['open', 'hold', 'scheduled', 'closed']

// Ski season: November through April
function isSkiSeason() {
  const month = new Date().getMonth() + 1 // 1–12
  return month >= 11 || month <= 4
}

function normalizeStats(lifts) {
  const counts = { open: 0, hold: 0, scheduled: 0, closed: 0 }
  const normalized = lifts.map(({ name, status }) => {
    const s = STATUSES.includes(status) ? status : 'closed'
    counts[s] = (counts[s] || 0) + 1
    return { name, status: s }
  })
  return {
    open: counts.open,
    total: lifts.length,
    breakdown: STATUSES.map(s => ({ status: s, count: counts[s] || 0 })),
    lifts: normalized,
  }
}

async function fetchMtnPowder(feedId) {
  const res = await fetch(`https://mtnpowder.com/feed/${feedId}/lifts`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return normalizeStats(
    data.map(lift => ({
      name: lift.Name,
      status: lift.StatusEnglish?.toLowerCase() || 'closed',
    }))
  )
}

async function fetchMtBachelor() {
  const res = await fetch('https://api.mtbachelor.com/api/v1/dor/drupal/lifts', {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return normalizeStats(
    data.map(lift => ({
      name: lift.name,
      status: lift.status?.toLowerCase() || 'closed',
    }))
  )
}

// Resorts with direct JSON APIs — no scraping service needed
const FETCHERS = {
  'crystal-mountain': () => fetchMtnPowder(80),
  'mtbachelor': fetchMtBachelor,
}

export async function getLiftStatus(slug) {
  if (!slug) return null
  if (!isSkiSeason()) return { offSeason: true }

  const fetcher = FETCHERS[slug]
  if (!fetcher) return null

  try {
    return await fetcher()
  } catch (err) {
    console.error('Failed to fetch lift status:', slug, err)
    return null
  }
}

export function liftStatusColor(status) {
  switch (status) {
    case 'open': return 'bg-good-dot'
    case 'hold': return 'bg-low-dot'
    case 'scheduled': return 'bg-mid-dot'
    default: return 'bg-flat-dot'
  }
}

export function liftStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
