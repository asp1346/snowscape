const ODOT_BASE_URL = 'https://api.odot.state.or.us/tripcheck'
const WSDOT_URL = 'https://www.wsdot.wa.gov/Traffic/api/MountainPassConditions/MountainPassConditionsREST.svc/GetMountainPassConditionsAsJson'

function containsChainKeyword(text) {
  return Boolean(text) && /chain/i.test(text)
}

function containsAdvisoryKeyword(text) {
  return Boolean(text) && /(advisory|caution|slick|icy|snow|wet|fog|traction)/i.test(text)
}

function classifyStatus({ chainsRequired, advisory }) {
  if (chainsRequired) return 'chains'
  if (advisory) return 'advisory'
  return 'clear'
}

async function getOdotRoadConditions(routeId) {
  const apiKey = process.env.ODOT_SUBSCRIPTION_KEY
  if (!apiKey) {
    console.error('ODOT_SUBSCRIPTION_KEY is not set')
    return null
  }

  try {
    const headers = { 'Ocp-Apim-Subscription-Key': apiKey, Accept: 'application/json' }

    const [reportsRes, metadataRes] = await Promise.all([
      fetch(`${ODOT_BASE_URL}/RW/Reports?RouteId=${encodeURIComponent(routeId)}`, {
        headers,
        next: { revalidate: 300 }
      }),
      fetch(`${ODOT_BASE_URL}/RW/Metadata`, {
        headers,
        next: { revalidate: 86400 }
      })
    ])

    if (!reportsRes.ok) {
      console.error('ODOT reports request failed:', routeId, reportsRes.status)
      return null
    }
    if (!metadataRes.ok) {
      console.error('ODOT metadata request failed:', metadataRes.status)
      return null
    }

    const reports = await reportsRes.json()
    const metadata = await metadataRes.json()

    // Route filters can span many stations; until we can verify live which
    // station sits closest to each resort's access road, we take the first.
    const report = reports?.['road-weather-reports']?.[0]
    if (!report) {
      // ODOT crews file these reports during active winter operations; an
      // empty feed outside that season is normal, not a fetch failure.
      return { source: 'ODOT', empty: true }
    }

    const items = metadata?.['road-weather-items'] || {}
    const roadCondList = items['road-condition-list'] || []
    const drivingRestrictionList = items['driving-restriction-list'] || []
    const commercialRestrictionList = items['commercial-vehicle-restriction-list'] || []

    const roadCondDesc = roadCondList.find(
      r => r['road-cond-id'] === report['road-conditions']?.['road-cond-id']
    )?.['road-cond-desc']

    const drivingRestrictionDesc = drivingRestrictionList.find(
      r => r['restriction-id'] === report['driving-restriction']?.['restriction-id']
    )?.['restriction-desc']

    const commercialRestrictionDesc = commercialRestrictionList.find(
      r => r['restriction-id'] === report['commercial-vehicle-restriction']?.['restriction-id']
    )?.['restriction-desc']

    const statusText = roadCondDesc || report.comments || 'No report available'
    const chainsRequired =
      containsChainKeyword(drivingRestrictionDesc) || containsChainKeyword(commercialRestrictionDesc)
    const advisory = containsAdvisoryKeyword(statusText) || containsAdvisoryKeyword(drivingRestrictionDesc)

    return {
      source: 'ODOT',
      statusText,
      status: classifyStatus({ chainsRequired, advisory }),
      chainsRequired,
      updatedAt: report['entry-time'] ? new Date(report['entry-time']) : null
    }
  } catch (err) {
    console.error('Failed to fetch ODOT road conditions:', err)
    return null
  }
}

function parseWcfDate(value) {
  const match = /\/Date\((-?\d+)/.exec(value || '')
  return match ? new Date(Number(match[1])) : null
}

async function getWsdotRoadConditions(passName) {
  const accessCode = process.env.WSDOT_ACCESS_CODE
  if (!accessCode) {
    console.error('WSDOT_ACCESS_CODE is not set')
    return null
  }

  try {
    const res = await fetch(`${WSDOT_URL}?AccessCode=${accessCode}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      console.error('WSDOT request failed:', passName, res.status)
      return null
    }

    const passes = await res.json()
    const pass = passes.find(p => p.MountainPassName?.toLowerCase().includes(passName.toLowerCase()))

    if (!pass) {
      console.error('WSDOT: no pass matched name', passName)
      return null
    }

    const restrictionTexts = [pass.RestrictionOne?.RestrictionText, pass.RestrictionTwo?.RestrictionText].filter(
      Boolean
    )
    const chainsRequired = restrictionTexts.some(containsChainKeyword)
    const advisory = pass.TravelAdvisoryActive || restrictionTexts.some(containsAdvisoryKeyword)

    return {
      source: 'WSDOT',
      statusText: pass.RoadCondition || 'No report available',
      status: classifyStatus({ chainsRequired, advisory }),
      chainsRequired,
      updatedAt: parseWcfDate(pass.DateUpdated)
    }
  } catch (err) {
    console.error('Failed to fetch WSDOT road conditions:', err)
    return null
  }
}

export async function getRoadConditions(resort) {
  if (!resort.road_api_id) return null

  if (resort.state === 'OR') {
    return getOdotRoadConditions(resort.road_api_id)
  }
  if (resort.state === 'WA') {
    return getWsdotRoadConditions(resort.road_api_id)
  }

  return null
}

export function roadStatusColorClasses(status) {
  if (status === 'chains') {
    return { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
  }
  if (status === 'advisory') {
    return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
  }
  return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' }
}

export function roadStatusLabel(status) {
  if (status === 'chains') return 'Chains required'
  if (status === 'advisory') return 'Advisory'
  return 'Clear'
}
