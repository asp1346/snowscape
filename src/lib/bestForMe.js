import { scoreFromValue, scoreFromValueInverse } from './conditions.js'
import { getLiftStatus } from './liftie.js'
import { getRoadConditions } from './roads.js'

// We don't know the visitor's actual location, so "drive time" is approximated
// as straight-line distance from the nearest major PNW metro per state.
const DRIVE_REFERENCE = {
  OR: { lat: 45.5152, lon: -122.6784 }, // Portland, OR
  WA: { lat: 47.6062, lon: -122.3321 } // Seattle, WA
}
const MAX_DRIVE_DISTANCE_MILES = 200

const REASONS = {
  freshSnow: 'Fresh snow is stacking up here',
  snowQuality: 'Cold temps are keeping snow quality high',
  driveTime: 'One of the closer drives for you',
  roadConditions: 'Access road is clear right now'
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180
  const earthRadiusMiles = 3958.8
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function driveTimeScore(resort) {
  const reference = DRIVE_REFERENCE[resort.state]
  if (!reference) return null
  const distance = haversineMiles(resort.latitude, resort.longitude, reference.lat, reference.lon)
  return scoreFromValueInverse(distance, MAX_DRIVE_DISTANCE_MILES)
}

function roadConditionScore(roadConditions) {
  if (!roadConditions || roadConditions.empty) return null
  if (roadConditions.status === 'clear') return 100
  if (roadConditions.status === 'advisory') return 60
  return 20 // chains required
}

async function getRoadConditionsByResortId(resorts) {
  const uniqueByKey = new Map()
  for (const resort of resorts) {
    if (!resort.road_api_id) continue
    const key = `${resort.state}:${resort.road_api_id}`
    if (!uniqueByKey.has(key)) uniqueByKey.set(key, resort)
  }

  const entries = await Promise.all(
    Array.from(uniqueByKey.entries()).map(async ([key, resort]) => [key, await getRoadConditions(resort)])
  )
  const conditionsByKey = new Map(entries)

  const byResortId = new Map()
  for (const resort of resorts) {
    const key = resort.road_api_id ? `${resort.state}:${resort.road_api_id}` : null
    byResortId.set(resort.id, key ? conditionsByKey.get(key) ?? null : null)
  }
  return byResortId
}

export async function scoreResorts(resorts, weights) {
  const [liftStatuses, roadConditionsByResortId] = await Promise.all([
    Promise.all(resorts.map(resort => getLiftStatus(resort.liftie_slug))),
    getRoadConditionsByResortId(resorts)
  ])

  const scored = resorts.map((resort, i) => {
    const liftStatus = liftStatuses[i]
    const roadConditions = roadConditionsByResortId.get(resort.id)

    const scores = {
      freshSnow: resort.weather.snowfall != null ? scoreFromValue(resort.weather.snowfall, 20) : null,
      snowQuality: resort.weather.temp != null ? scoreFromValueInverse(resort.weather.temp, 50) : null,
      driveTime: driveTimeScore(resort),
      roadConditions: roadConditionScore(roadConditions)
    }

    const activeCriteria = Object.keys(scores).filter(key => scores[key] != null && weights[key] > 0)
    const totalWeight = activeCriteria.reduce((sum, key) => sum + weights[key], 0)

    const compositeScore =
      totalWeight > 0
        ? Math.round(
            activeCriteria.reduce((sum, key) => sum + weights[key] * scores[key], 0) / totalWeight
          )
        : null

    const reasonKey = activeCriteria
      .slice()
      .sort((a, b) => weights[b] * scores[b] - weights[a] * scores[a])[0]

    return {
      id: resort.id,
      name: resort.name,
      compositeScore,
      reason: reasonKey ? REASONS[reasonKey] : null,
      snowDepth: resort.weather.snowDepth,
      temp: resort.weather.temp,
      openLifts: liftStatus ? liftStatus.open : null,
      totalLifts: liftStatus ? liftStatus.total : null
    }
  })

  return scored
    .filter(resort => resort.compositeScore != null)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .map((resort, i) => ({ ...resort, rank: i + 1 }))
}
