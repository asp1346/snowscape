const STATUSES = ['open', 'hold', 'scheduled', 'closed']

export async function getLiftStatus(slug) {
  if (!slug) return null

  try {
    const res = await fetch(`https://liftie.info/api/resort/${slug}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      console.error('Liftie request failed:', slug, res.status)
      return null
    }

    const data = await res.json()
    const stats = data.lifts?.stats
    const status = data.lifts?.status

    if (!stats || !status) return null

    const total = STATUSES.reduce((sum, s) => sum + (stats[s] || 0), 0)

    return {
      open: stats.open || 0,
      total,
      breakdown: STATUSES.map(s => ({ status: s, count: stats[s] || 0 })),
      lifts: Object.entries(status).map(([name, liftStatus]) => ({ name, status: liftStatus }))
    }
  } catch (err) {
    console.error('Failed to fetch Liftie status:', err)
    return null
  }
}

export function liftStatusColor(status) {
  switch (status) {
    case 'open': return 'bg-emerald-500'
    case 'hold': return 'bg-amber-500'
    case 'scheduled': return 'bg-blue-500'
    default: return 'bg-neutral-600'
  }
}

export function liftStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
