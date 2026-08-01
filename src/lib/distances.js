import { geocodeZip } from './geocode.js'

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8 // miles
  const toRad = d => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export async function getDistancesFromZip(zipCode, resorts) {
  const location = await geocodeZip(zipCode)
  if (!location) return {}

  return Object.fromEntries(
    resorts.map(resort => [
      resort.id,
      haversine(location.lat, location.lng, resort.latitude, resort.longitude),
    ])
  )
}
